import express from 'express';

//import controller functions
import { verifyCardId, setProces } from '../controllers/barcode.js';

const router = express.Router();

//all the routes that have to do something with barcodes
router.get('/user/:id', verifyCardId);
router.post('/operace', setProces);

export default router;
