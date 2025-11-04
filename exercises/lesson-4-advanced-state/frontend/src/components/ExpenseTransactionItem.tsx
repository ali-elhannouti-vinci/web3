import type { Transaction } from "@/types/Transaction";
import { NavLink } from "react-router";

// 💡 DÉFINI UNE SEULE FOIS (en dehors du composant)
const DATE_FORMAT_OPTIONS = {
  year: "numeric" as const,
  month: "2-digit" as const,
  day: "2-digit" as const,
  timeZone: "UTC" as const, // Utiliser 'as const' améliore la typage
};

export default function ExpenseTransactionItem({
  id,
  amount,
  date,
  payer,
  participants,
}: Transaction) {
  // 2. UTILISÉ à chaque rendu, mais l'objet de référence est stable
  const formattedDate = new Date(date).toLocaleDateString(
    "fr-FR",
    DATE_FORMAT_OPTIONS
  );

  const expenseId = id.replace("expense-", "");

  return (
    <>
      <h1>
        {payer.name} paid ${amount} for {participants.length} people on{" "}
        {formattedDate}
      </h1>
      <div className="inline-flex border rounded-lg border-green-700 ">
        <NavLink to={`/expenses/${expenseId}`}>Détails</NavLink>
      </div>
    </>
  );
}
