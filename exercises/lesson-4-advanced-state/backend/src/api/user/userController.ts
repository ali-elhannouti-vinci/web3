import { StatusCodes } from "http-status-codes";
import { getAllUsers } from "./userRepository";
import { Request, Response } from "express";

export async function listAllUsers(req: Request, res: Response) {
  const allUsers = await getAllUsers();
  res.status(StatusCodes.OK).json(allUsers);
}
