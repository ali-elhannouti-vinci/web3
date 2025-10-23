export interface Expense {
  id: number;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

export type ExpenseInput = Omit<Expense, "id">;
