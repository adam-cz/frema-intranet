import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  authGetRecords,
  authCreateRecord,
  authEditRecord,
  authDeleteRecord,
} from '../middleware/crm.js';

//import controller functions
import {
  fetchCrmRecords,
  deleteCrmRecord,
  addCrmRecord,
  addCrmText,
} from '../controllers/crm.js';
import { fetchCustomers, addCustomer } from '../controllers/customer.js';

const router = express.Router();

router.use(authenticateToken);

//all the routes that have to do something with sales
router.get('/crm', authGetRecords, fetchCrmRecords);
router.post('/crm', authCreateRecord, addCrmRecord);
//router.put('/crm/:recordID', authEditRecord, editCrmRecord);
router.delete('/crm/:recordID', authDeleteRecord, deleteCrmRecord);

router.post('/crm/text', addCrmText);

router.get('/customers', fetchCustomers);
router.post('/customers', addCustomer);

export default router;
