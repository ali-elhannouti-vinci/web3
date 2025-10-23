import { useState, useEffect } from "react";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseAdd from "../components/ExpenseAdd";
import type { Expense, ExpenseInput } from "../types/Expense";

const host = import.meta.env.VITE_API_URL || "http://unknown-api-url.com";

export default function Home() {
    
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sendApiRequestandHandleError = async (
    method: string = "GET",
    path: string,
    body?: any
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

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await sendApiRequestandHandleError("GET", "expenses");
      
      // Assurer que setExpenses reçoit toujours un tableau pour éviter les erreurs
      setExpenses(Array.isArray(data) ? data : []); 
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (newExpense: ExpenseInput) => {
    const addedExpense: Expense = await sendApiRequestandHandleError(
      "POST",
      "expenses",
      newExpense
    );   
    const newExpensesActual = [addedExpense, ...expenses]; 
    setExpenses(newExpensesActual);
  };

  const handleResetData = async () => {
    setExpenses([]); // Clear current expenses optimistically
    setLoading(true);

    const resetData = await sendApiRequestandHandleError(
      "POST",
      "expenses/reset"
    );
    // Assurer que setExpenses reçoit toujours un tableau
    setExpenses(Array.isArray(resetData.data) ? resetData.data : []);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading expenses...</div>;
  }

  return (
    <div>
      <h1>Expense Sharing App</h1>

      {error && <div>Error: {error}</div>}

      <div>
        <ExpenseAdd addExpense={handleAddExpense} />
        <button onClick={handleResetData}>Reset Data</button>
      </div>

      <h2>Expenses ({expenses.length})</h2>

      <div>
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          expenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))
        )}
      </div>
    </div>
  );
}