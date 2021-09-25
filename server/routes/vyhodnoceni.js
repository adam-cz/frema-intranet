import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authGetData } from '../middleware/production.js';

//import controller functions
import {
  getOrderNumber,
  fetchList,
  fetchData,
  createProcedure,
} from '../controllers/vyhodnoceni.js';

const router = express.Router();

//all the routes that have to do something with orders
router.get('/test', authenticateToken, authGetData, fetchData);
router.get('/objednavky', authenticateToken, authGetData, fetchList);
router.get('/finaly', authenticateToken, authGetData, fetchList);
router.get('/opv', authenticateToken, authGetData, fetchList);
router.get('/opt/:final', authenticateToken, authGetData, getOrderNumber);
router.get('/operace/:order', authenticateToken, authGetData, fetchData);
router.post('/create', authenticateToken, authGetData, createProcedure);

export default router;
