import ApiClient from "@/lib/api";
import type { Expense } from "@/types/Expense";
import type { LoaderFunction } from "react-router";

export interface LoaderData {
    expense: Expense;
}

export const loader : LoaderFunction = async ({
  params
}) => {
    const idString = params.id; // Type: string | undefined

  if (!idString) {
    throw new Response("ID manquant", { status: 400 });
  }

  // 💡 Conversion explicite en nombre
  const idNumber = Number(idString); 

  if (isNaN(idNumber)) {
    throw new Response("ID non valide", { status: 400 });
  }

    const expenses = await ApiClient.getExpenseById(idNumber);
    return { expenses };
}