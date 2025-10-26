import type { Expense } from "../types/Expense";

interface ExpenseItemProps {
  expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  const tdBaseTwClasses = "border text-left p-5";
  return (
    <tr className="hover:bg-gray-600">
      <td className={tdBaseTwClasses}>#{expense.id}</td>
      <td className={tdBaseTwClasses}>{expense.date}</td>
      <td className={tdBaseTwClasses}>{expense.description}</td>
      <td className={tdBaseTwClasses}>
        Paid by <span>{expense.payer}</span>
      </td>
      <td className={tdBaseTwClasses.replace('text-left','text-right')}>${expense.amount.toFixed(2)}</td>
    </tr>
  );
}
