const {parseJsonFile,serializeToJsonFile} = require('../utils/json-utils')
const path = require('path');

const EXPENSES_PATH = path.join(__dirname, '..', 'data', 'expenses.json');

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

module.exports = {getAllExpenses,addExpense}