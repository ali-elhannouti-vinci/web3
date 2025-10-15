var express = require("express");
var router = express.Router();
const { addExpense, getAllExpenses,resetExpenses } = require("../services/expenses.js");

router.get("/",async function (req, res, next) {
  const allExpenses = await getAllExpenses();
  console.log('All expenses in the router',allExpenses);
  
  return res.json(allExpenses);
});

router.post("/",async function (req, res, next) {
  const amount = req?.body?.amount;
  if (!amount || typeof amount !== "number" || amount < 0 || amount > 100) {
    return res.sendStatus(400);
  }

  const description = req?.body?.description;
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    return res.sendStatus(400);
  }

  const addedExpenseId = await addExpense({ description, amount });
  return res.json(addedExpenseId);
});

router.post("/reset",async function (req, res, next) {
  const resetData = resetExpenses();
  if (resetData === 500) {
    return res.sendStatus(500);
  }
  console.log("Reset data dans routes : ",resetData);
  
  return res.json(resetData);
});

module.exports = router;
