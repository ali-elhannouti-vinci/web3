import type { Expense } from "../types/Expense";
import { TableRow,TableCell } from "./ui/table";

interface ExpenseItemProps {
  expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <TableRow>
      <TableCell className={"tableCell"}>#{expense.id}</TableCell>
      <TableCell className={"tableCell"}>{expense.date}</TableCell>
      <TableCell className={"tableCell"}>{expense.description}</TableCell>
      <TableCell className={"tableCell"}>
        Paid by <span>{expense.payer}</span>
      </TableCell>
      <TableCell className={"tableCell".replace('text-left','text-right')}>${expense.amount.toFixed(2)}</TableCell>
    </TableRow>
  );
}
