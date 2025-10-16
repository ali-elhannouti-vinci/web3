import { useEffect, useState } from "react";
import ExpenseItem from "../components/ExpenseItem/ExpenseItem";
import type { Expense } from "../types/Expense";
import ExpenseAdd from "../components/ExpenseAdd/ExpenseAdd";

function Home() {
  const defaultExpenses: Expense[] = [
  ];
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [loading, setLoading] = useState(false); // is fetch in progress?
  const [error, setError] = useState(""); // error message
  

  const fetchExpenses = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:3000/api/expenses");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const expensesJson = await response.json();
        setExpenses(expensesJson);
      } catch (err : unknown) {
        if(err instanceof Error)
          setError(err.message)
      }finally{
          setLoading(false);
      }
    }

  useEffect(() => {
    try{
      fetchExpenses()
    }catch (err : unknown) {
        if(err instanceof Error)
          setError(err.message)
    }
  },[])
  async function handleAdd() {
    setError("");

    const amount = Math.round((Math.random() * (100 - 0 + 1)) * 100) / 100;

    const description = "Description example"

    const addedExpense = {description,amount}

    try {
    const response = await fetch("http://localhost:3000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addedExpense), // ✅ on envoie du JSON
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const addedExpenseId = await response.json(); // ✅ on récupère la réponse (JSON)
    console.log("Id de la dépense ajoutée :", addedExpenseId);
    await fetchExpenses();
    return addedExpenseId;
  } catch (err : unknown) {
        if(err instanceof Error)
          setError(err.message)
  }
  }

  async function handleReset() {
    setError("");
    const fetchOptions = {
      method:"POST"
    }
    try {
      const response = await fetch("http://localhost:3000/api/expenses/reset",fetchOptions);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const responseData = await response.json();
      await fetchExpenses();
      return responseData;
    } catch (err : unknown) {
        if(err instanceof Error)
          setError(err.message)
    }
  }

  if (loading) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    )
  }
  if (error !== "") {
    return (
      <>
        <h1>Error : {error}</h1>
      </>
    ) 
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
      <button onClick={handleReset}>Reset expenses list</button>
    </>
  );
}

export default Home;
