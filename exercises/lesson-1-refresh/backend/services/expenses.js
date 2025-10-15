const {parseJsonFile,serializeToJsonFile, parseJsonFileSync, serializeToJsonFileSync} = require('../utils/json-utils')
const path = require('path');

const EXPENSES_PATH = path.join(__dirname, '..', 'data', 'expenses.json');
const EXPENSES_INIT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "expenses.init.json"
);

async function getAllExpenses()  {
    const expenses = await parseJsonFile(EXPENSES_PATH);
    console.log('All expenses : ',expenses);
    JSON.stringify(expenses)
    return expenses;
}

async function addExpense({description,amount}) {
    const id = Date.now().toString();

    const dateObj = new Date();
    const date = dateObj.toISOString().slice(0, 10);

    const possiblePayer = ["Alice","Bob"]
    const randomIndex = Math.floor(Math.random() * possiblePayer.length);
    const payer = possiblePayer[randomIndex]

    const addedExpense = {
        id,
        date,
        description,
        payer,
        amount   
    }

    const expenses = await parseJsonFile(EXPENSES_PATH);

    const newExpenses = ([...expenses,addedExpense])
    serializeToJsonFile(EXPENSES_PATH,newExpenses);
    return id
}

function resetExpenses() {
    try {
        const init_expenses = parseJsonFileSync(EXPENSES_INIT_PATH);
        console.log("Expenses pour le reset : ",init_expenses);
        serializeToJsonFileSync(EXPENSES_PATH,init_expenses);
        return init_expenses;
    }catch(err) {
          console.error('Erreur lors du reset des data d expenses lors du traitement des fichiers de data', err);
          return 500;
    }
}

module.exports = {getAllExpenses,addExpense,resetExpenses}