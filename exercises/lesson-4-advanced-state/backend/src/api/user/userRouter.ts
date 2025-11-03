import { Router } from "express";
import { listAllUsers } from "./userController";
const router = Router();

router.get("/", listAllUsers);

export default router;
