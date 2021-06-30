import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

//import controller functions
import {
  fetchCrmRecords,
  addCrmRecord,
  addCrmText,
} from '../controllers/crm.js';
import { fetchCustomers, addCustomer } from '../controllers/customer.js';

const router = express.Router();

router.use(authenticateToken);

//all the routes that have to do something with crm
router.get('/', fetchCrmRecords);
router.post('/add', addCrmRecord);
router.post('/addtext', addCrmText);
router.get('/customers', fetchCustomers);
router.post('/customers/add', addCustomer);

export default router;
