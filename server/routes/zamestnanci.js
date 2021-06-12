import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

//import controller functions
import {
  fetchEmployees,
  updateEmployees,
  present,
} from '../controllers/zamestnanci.js';

const router = express.Router();

//all the routes that have to do something with _items
router.post('/', authenticateToken, fetchEmployees);
router.get('/load', updateEmployees);
router.get('/present', present);

export default router;
