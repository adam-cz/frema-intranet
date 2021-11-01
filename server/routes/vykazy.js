import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
//import { authGetData } from '../middleware/production.js';

//import controller functions
import {
  fetchVykazy,
  smazatVykazy,
  ukoncitVykaz,
} from '../controllers/vykazy.js';

const router = express.Router();

//all the routes that have to do something with orders
router.post('/', authenticateToken, fetchVykazy);
router.post('/ukoncit', authenticateToken, ukoncitVykaz);
router.delete('/smazat', authenticateToken, smazatVykazy);

export default router;
