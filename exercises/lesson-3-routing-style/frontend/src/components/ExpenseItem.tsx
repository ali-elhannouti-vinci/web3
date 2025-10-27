import type { Expense } from "../types/Expense";
import { TableRow,TableCell } from "./ui/table";

interface ExpenseItemProps {
  expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  const tdBaseTwClasses = "border text-left p-1 ";
  return (
    <TableRow className="hover:bg-gray-600">
      <TableCell className={tdBaseTwClasses}>#{expense.id}</TableCell>
      <TableCell className={tdBaseTwClasses}>{expense.date}</TableCell>
      <TableCell className={tdBaseTwClasses}>{expense.description}</TableCell>
      <TableCell className={tdBaseTwClasses}>
        Paid by <span>{expense.payer}</span>
      </TableCell>
      <TableCell className={tdBaseTwClasses.replace('text-left','text-right')}>${expense.amount.toFixed(2)}</TableCell>
    </TableRow>
  );
}
