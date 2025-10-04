interface Expense {
  id: string;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

type NewExpense = Omit<Expense,'id'>;

export type {Expense,NewExpense}

