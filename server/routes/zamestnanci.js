import express from 'express';

//import controller functions
import { fetchEmployees, loadEmployees } from '../controllers/zamestnanci.js';

const router = express.Router();

//all the routes that have to do something with _items
router.get('/', fetchEmployees);
router.get('/load', loadEmployees);

export default router;
