import { Router } from "express";
import { listAllTransactions } from "./transactionController";
const router = Router();

router.get("/", listAllTransactions);

export default router;
