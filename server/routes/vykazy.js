import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
//import { authGetData } from '../middleware/production.js';

//import controller functions
import { fetchVykazy } from '../controllers/vykazy.js';

const router = express.Router();

//all the routes that have to do something with orders
router.get('/', authenticateToken, fetchVykazy);

export default router;
