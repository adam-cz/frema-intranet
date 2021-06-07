import express from 'express';

//import controller functions
import { fetchEmployees, updateEmployees } from '../controllers/zamestnanci.js';

const router = express.Router();

//all the routes that have to do something with _items
router.get('/', fetchEmployees);
router.get('/load', updateEmployees);

export default router;
