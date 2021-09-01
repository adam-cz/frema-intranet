import express from 'express';

//import controller functions
import { verifyCardId } from '../controllers/barcode.js';

const router = express.Router();

//all the routes that have to do something with barcodes
router.get('/user/:id', verifyCardId);

export default router;
