import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

//import controller functions
import { fetchCrmRecords, addCrmRecord } from '../controllers/crm.js';

const router = express.Router();

//all the routes that have to do something with crm
router.get('/', authenticateToken, fetchCrmRecords);
router.post('/add', addCrmRecord);

export default router;
