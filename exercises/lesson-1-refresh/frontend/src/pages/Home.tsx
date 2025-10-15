import { useEffect, useState } from "react";
import ExpenseItem from "../components/ExpenseItem/ExpenseItem";
import type { Expense } from "../types/Expense";
import ExpenseAdd from "../components/ExpenseAdd/ExpenseAdd";

function Home() {
  const defaultExpenses: Expense[] = [
  ];
  const [expenses, setExpenses] = useState(defaultExpenses);

  const fetchResponses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/expenses");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setExpenses(json);
      } catch (err) {
        console.log(err);
      }
    }

  useEffect(() => {
    fetchResponses()
  },[])
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
