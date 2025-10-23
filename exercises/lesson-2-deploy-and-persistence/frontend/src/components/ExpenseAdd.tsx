
import type { ExpenseInput } from "../types/Expense";
import Form from "./Form";

interface ExpenseAddProps {
  addExpense: (expense: ExpenseInput) => void;
}

export default function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const onSubmit = (data: ExpenseInput) => {
  data.date = data.date + "T00:00:00.000Z";
  addExpense(data);
};

  return (
    <>
      <Form onSubmit={onSubmit}></Form>
    </>
  );
}
