import { StatusCodes } from "http-status-codes";
import { getAllTransactions } from "./transactionRepository";
import { Request, Response } from "express";

export async function listAllTransactions(req: Request, res: Response) {
  const allTransactions = await getAllTransactions();
  res.status(StatusCodes.OK).json(allTransactions);
}
