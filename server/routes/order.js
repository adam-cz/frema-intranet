import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

//import controller functions
import { fetchOrders, fetchProcedures } from '../controllers/order.js';

const router = express.Router();

//all the routes that have to do something with orders
router.get('/', fetchOrders);
router.get('/:order', fetchProcedures);

export default router;
