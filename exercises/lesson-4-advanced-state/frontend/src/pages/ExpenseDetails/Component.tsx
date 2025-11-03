import { useLoaderData } from "react-router";
import type { LoaderData } from "./loader";

export default function ExpenseDetails() {
  const { expense : {payer,participants,amount} } = useLoaderData<LoaderData>();
  const shareForTheExpense = amount/participants.length
  return <>
    <div>Payer : {payer.name} {payer.email} {payer.bankAccount ?? ""}</div>
    <div>Participants : </div><br />
    {participants.map((participant) => {
        return <><div>{participant.name} {participant.email} {participant.bankAccount ?? ""} Share : {shareForTheExpense}</div><br /></>
    })}
  </>;
}
