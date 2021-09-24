import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authGetData } from '../middleware/production.js';

//import controller functions
import {
  fetchOrders,
  fetchData,
  createProcedure,
} from '../controllers/order.js';

const router = express.Router();

//all the routes that have to do something with orders
router.get('/test', fetchData);
router.get('/', authenticateToken, authGetData, fetchOrders);
router.get('/:order', authenticateToken, authGetData, fetchData);
router.post('/create', authenticateToken, authGetData, createProcedure);

export default router;
