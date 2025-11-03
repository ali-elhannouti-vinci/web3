import type { Transaction } from "@/types/Transaction";

// 💡 DÉFINI UNE SEULE FOIS (en dehors du composant)
const DATE_FORMAT_OPTIONS = {
  year: "numeric" as const,
  month: "2-digit" as const,
  day: "2-digit" as const,
  timeZone: "UTC" as const, // Utiliser 'as const' améliore la typage
};

export default function TransferTransactionItem({
  amount,
  date, // Chaîne ISO
  payer,
  participants,
}: Transaction) {
  // 2. UTILISÉ à chaque rendu, mais l'objet de référence est stable
  const formattedDate = new Date(date).toLocaleDateString(
    "fr-FR",
    DATE_FORMAT_OPTIONS
  );

  return (
    <h1>
      {payer.name} transferred €{amount} to {participants[0].name} on 
      {formattedDate}
    </h1>
  );
}
