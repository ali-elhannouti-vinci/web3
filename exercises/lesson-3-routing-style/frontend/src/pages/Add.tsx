import { useState } from "react";
import ExpenseAdd from "../components/ExpenseAdd";
import type { Expense, ExpenseInput } from "../types/Expense";
import { useNavigate } from "react-router-dom";
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
    } as Expense;
    const originalExpenses = expenses; // Sauvegarde de l'état original
    setExpenses([newExpenseOptimistic, ...originalExpenses]); // Optimistic Update

    try {
      const addedExpense = await sendApiRequestandHandleError(
        "POST",
        "expenses",
        newExpenseForm
      );

      // 🛑 AJOUT CLÉ : Vérifiez si la fonction utilitaire a échoué (renvoyé undefined)
      if (!addedExpense) {
        // Si addedExpense est undefined, cela signifie que sendApiRequestandHandleError
        // a intercepté une erreur (comme 500) et a appelé setError.
        // Nous lançons une erreur ici pour forcer le passage au bloc catch ci-dessous.
        throw new Error("API request failed (check error state for details)");
      }

      // --- SUCCÈS (SEULEMENT SI addedExpense est défini) ---
      // 1. Remplacer l'élément optimiste.
      const newExpensesActual = [addedExpense, ...originalExpenses];
      setExpenses(newExpensesActual);

      // 2. Afficher le toast de succès.
      toast.success("Expense successfully added!", { duration: 3500 });

      // 3. Naviguer.
      navigate("/list");
    } catch (error) {
      // --- ÉCHEC (MAINTENANT DÉCLENCHÉ EN CAS D'ERREUR 500) ---
      // L'état d'erreur 'error' a déjà été mis à jour par sendApiRequestandHandleError
      // (même si de manière asynchrone, il est plus sûr d'afficher le toast ici).

      // 1. Revenir à l'état original (annuler l'optimisme).
      setExpenses(originalExpenses);

      // 2. Afficher le toast d'erreur.
      // On affiche l'erreur contenue dans l'état 'error' ou l'erreur propagée si elle n'a pas été gérée.
      const errorMessage = error instanceof Error ? error.message : "API Error";
      const messageToCheck = errorMessage.toLowerCase();

      toast.error(
        `Failed: ${
          messageToCheck.includes("api request failed")
            ? "Expense creation failed. Check API logs." // ⬅️ Message adapté à l'utilisateur
            : "Unknown error. Check console."
        }`,
        { duration: 5000 }
      );
    }
  };

  return (
    <>
      {error && <div>Error: {error}</div>}
      <h1 className="text-4xl">Add an expense</h1>

      <div>
        <ExpenseAdd addExpense={handleAddExpense} />
      </div>
    </>
  );
}
