import { useState } from "react";
import ExpenseAdd from "../components/ExpenseAdd";
import type { Expense, ExpenseInput } from "../types/Expense";
import {  useNavigate } from "react-router-dom";
import { toast } from "sonner";

const host = import.meta.env.VITE_API_URL;

export default function Add() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const sendApiRequestandHandleError = async (
    method: string = "GET",
    path: string,
    body?: unknown
  ) => {
    try {
      const response = await fetch(`${host}/api/${path}`, {
        method: method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };
  const handleAddExpense = async (newExpenseForm: ExpenseInput) => {
    const newExpenseOptimistic = {
      id: "optimistic",
      ...newExpenseForm,
    } as Expense; // We add a temporary id -1 for React key, it will be replaced when we get the real added expense from backend
    const newExpensesOptimistic = [newExpenseOptimistic, ...expenses]; // Optimistically update the state, whatever the sort method, add on top
    setExpenses(newExpensesOptimistic);
    const addedExpense = await sendApiRequestandHandleError(
      "POST",
      "expenses",
      newExpenseForm
    );
    const newExpensesActual = [addedExpense, ...expenses]; // Now that we have the actual added expense with id from backend, let's use it instead of the optimistically added one
    setExpenses(newExpensesActual);
    toast.success("Expense successfuly added !",{
      duration:3500
    })
    navigate('/list')
  };

  return (
    <>
      {error && <div>Error: {error}</div>}
      <h2>Add an expense</h2>

      <div>
        <ExpenseAdd addExpense={handleAddExpense} />
      </div>
    </>
  );
}
