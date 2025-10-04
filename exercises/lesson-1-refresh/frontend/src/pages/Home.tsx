import { useState } from "react";
import ExpenseItem from "../components/ExpenseItem/ExpenseItem";
import type { Expense } from "../types/Expense";
import ExpenseAdd from "../components/ExpenseAdd/ExpenseAdd";

function Home() {
  const defaultExpenses: Expense[] = [
    {
      id: "1",
      date: "2025-09-28",
      description: "Fournitures de bureau (stylos, papier)",
      payer: "Alice",
      amount: 45.5,
    },
    {
      id: "2",
      date: "2025-09-30",
      description: "Déjeuner de travail avec le client",
      payer: "Bob",
      amount: 120.0,
    },
    {
      id: "3",
      date: "2025-10-02",
      description: "Renouvellement de la licence Logiciel Pro",
      payer: "Charlie",
      amount: 399.99,
    },
  ];
  const [expenses, setExpenses] = useState(defaultExpenses);

  function handleAdd() : string {

    const possiblePayer = ["Alice","Bob"]
    const randomIndex = Math.floor(Math.random() * possiblePayer.length);
    const payer = possiblePayer[randomIndex]

    const amount = Math.round((Math.random() * (100 - 0 + 1)) * 100) / 100;
    
    const id = Date.now().toString();
    
    const dateObj = new Date();
    const date = dateObj.toISOString().slice(0, 10);

    const description = "Description example"

    const addedExpense = {id,date,description,payer,amount}

    const newExpenses = [...expenses,addedExpense]
    setExpenses(newExpenses)
    return id;
  }
  return (
    <>
      <h1>Liste des Dépenses Récentes</h1>

      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          id={expense.id}
          date={expense.date}
          description={expense.description}
          payer={expense.payer}
          amount={expense.amount}
        />
      ))}
      <ExpenseAdd handleAdd={handleAdd}></ExpenseAdd>
    </>
  );
}

export default Home;
