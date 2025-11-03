import { PrismaClient } from "../../../generated/prisma";
import * as TransactionModel from "./TransactionModel";

const prisma = new PrismaClient();

export async function getAllTransactions(): Promise<
  TransactionModel.Transaction[]
> {
  const expensesPromise = prisma.expense.findMany({
    include: {
      payer: true,
      participants: true,
    },
  });
  const transfersPromise = prisma.transfer.findMany({
    include: {
      source:true,
      target:true
    },
  });

  const [expenses, transfers] = await Promise.all([
    expensesPromise,
    transfersPromise,
  ]);

  const normalizedExpenses = expenses.map((expense) =>
    TransactionModel.fromExpense(expense)
  );
  const normalizedTransfers = transfers.map((transfer) =>
    TransactionModel.fromTransfer(transfer)
  );

  return [...normalizedExpenses, ...normalizedTransfers].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}
