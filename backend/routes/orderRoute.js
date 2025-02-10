import express from 'express';
import { placeOrder, getOrders, closeOrder, getDeliverOrders } from '../controllers/orderController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter.get('/', authenticateToken, getOrders);
orderRouter.get('/deliver', authenticateToken, getDeliverOrders); // New endpoint for deliveries
orderRouter.post('/place', authenticateToken, placeOrder);
orderRouter.post('/close', authenticateToken, closeOrder); // New endpoint for closing orders

export default orderRouter;
