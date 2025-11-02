import type { Request, Response } from "express";
import * as expenseRepository from "./transferRepository";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export async function listTransfers(req: Request, res: Response) {
  const transfers = await expenseRepository.getAllTransfers();
  res.status(StatusCodes.OK).json(transfers);
}

export async function getTransferDetail(req: Request, res: Response) {
  const id = Number(req.params.id);
  const transfer = await expenseRepository.getTransferById(id);
  if (!transfer) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Transfer not found" });
  }
  res.status(StatusCodes.OK).json(transfer);
}

export async function createTransfer(req: Request, res: Response) {
  const { amount,date,sourceId,targetId } = req.body;

  const newTransfer = await expenseRepository.createTransfer({
    amount,date,sourceId,targetId
  });
  res.status(StatusCodes.CREATED).json(newTransfer);
}
