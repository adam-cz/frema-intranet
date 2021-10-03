import express from 'express';

//import controller functions
import { verifyCardId, setProces, ping } from '../controllers/barcode.js';

const router = express.Router();

//all the routes that have to do something with barcodes
router.get('/user/:id', verifyCardId);
router.post('/operace', setProces);
router.get('/ping', ping);

export default router;
