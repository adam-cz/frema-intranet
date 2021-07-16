import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  authGetRecords,
  authCreateRecord,
  authEditRecord,
  authDeleteRecord,
} from '../middleware/crm.js';
import {
  authGetCustomers,
  authCreateCustomer,
  authEditCustomer,
  authDeleteCustomer,
} from '../middleware/customer.js';

//import controller functions
import {
  fetchCrmRecords,
  deleteCrmRecord,
  addCrmRecord,
  addCrmText,
} from '../controllers/crm.js';
import {
  fetchCustomers,
  addCustomer,
  deleteCustomer,
} from '../controllers/customer.js';
import {
  editCustomerPerson,
  deleteCustomerPerson,
} from '../controllers/customer.js';

const router = express.Router();

router.use(authenticateToken);

//CRM routes
router.get('/crm', authGetRecords, fetchCrmRecords);
router.post('/crm', authCreateRecord, addCrmRecord);
//router.put('/crm/:recordID', authEditRecord, editCrmRecord);
router.delete('/crm/:recordID', authDeleteRecord, deleteCrmRecord);

//CRM record texts
router.post('/crm/text', addCrmText);

//customers
router.get('/customers', authGetCustomers, fetchCustomers);
router.post('/customers', authCreateCustomer, addCustomer);
router.delete('/cusotmers/:customerID', authDeleteCustomer, deleteCustomer);

//customer contacts
router.put('/customers/person', editCustomerPerson);
router.delete('/customers/person', deleteCustomerPerson);

export default router;
