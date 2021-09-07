import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authGetData } from '../middleware/production.js';

//import controller functions
import {
  fetchOrders,
  fetchProcedures,
  createProcedure,
} from '../controllers/order.js';

const router = express.Router();

//all the routes that have to do something with orders
router.get('/', authenticateToken, authGetData, fetchOrders);
router.get('/:order', authenticateToken, authGetData, fetchProcedures);
router.post('/create', authenticateToken, authGetData, createProcedure);

export default router;
