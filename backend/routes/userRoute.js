import express from 'express';
import { login, register, checkToken, details, update } from '../controllers/userController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { chat } from '../controllers/chatController.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/checkToken', checkToken);
userRouter.post('/details', authenticateToken, details);
userRouter.post('/update', authenticateToken, update);
userRouter.post('/chat', authenticateToken, chat);

export default userRouter;