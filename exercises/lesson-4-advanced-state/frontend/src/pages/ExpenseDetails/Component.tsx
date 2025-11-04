import { useLoaderData } from "react-router";
import type { LoaderData } from "./loader";

export default function ExpenseDetails() {
  const {
    expense: { payer, participants, amount },
  } = useLoaderData<LoaderData>();

  const shareForTheExpense = amount / participants.length;

  return (
    <>
      <div className="border inline-block border-green-800 my-1 bg-green-400">
        Payer : {payer.name} {payer.email} {payer.bankAccount ?? ""}
      </div>
      <table>
        <thead>
          <tr>
            {" "}
            <th className="border border-green-800">Participants</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
        return (
          <tr className="border border-green-800">
            <div>
              {participant.name} {participant.email}{" "}
              {participant.bankAccount ?? ""}{" "}
            </div>
            <div>Share : {shareForTheExpense}</div>
          </tr>
        );
      })}
        </tbody>
      </table>

      
    </>
  );
}
