import { useEffect, useState } from "react";
import ExpenseItem from "../components/ExpenseItem";
import type { Expense } from "../types/Expense";
import {
  Table,
  TableBody,
  TableCaption,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const host = import.meta.env.VITE_API_URL;

export default function List() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      // Revenir à la version originale : appeler .json() directement
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
      // Nous nous attendons à ce que sendApiRequestandHandleError retourne un tableau d'Expense
      const data = (await sendApiRequestandHandleError("GET", "expenses")) as
        | Expense[]
        | null;
      if (data) {
        setExpenses(data);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return <div>Chargement des dépenses...</div>;
  }

  return (
    <>
      <h1>Expense Sharing App</h1>

      {error && <div>Erreur: {error}</div>}
      <h2>Dépenses ({expenses.length})</h2>
      <div>
        {expenses.length === 0 ? (
          <p>Aucune dépense trouvée.</p>
        ) : (
          <div className="overflow-x-auto border">
            <Table>
              <TableCaption>Expenses list</TableCaption>
              <TableHeader>
                {/* hover:bg-background pour désactiver le gris par défaut quand on hover sur une TableRow */}
                <TableRow className="hover:bg-background">
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Payer</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
