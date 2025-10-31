  import { Router } from 'express';
import { sendAllUsers } from './userController';
const router = Router();

router.get('/',sendAllUsers);

export default router;