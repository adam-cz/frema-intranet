import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

//import controller functions
import { fetchEmployees, updateEmployees } from '../controllers/employees.js';

const router = express.Router();

//all the routes that have to do something with employees list
router.get('/', authenticateToken, fetchEmployees);
router.get('/load', updateEmployees);

export default router;
