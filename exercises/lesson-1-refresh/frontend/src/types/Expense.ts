interface Expense {
  id: string;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

type NewExpense = Pick<Expense,'amount' | 'description'>;

export type {Expense,NewExpense}

