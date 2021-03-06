import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { appSite } from './config/server.js';

//CRONE IMPORT
import './utils/cron.js';

//ROUTES IMPORT
import employeesRouter from './routes/employees.js';
import salesRouter from './routes/sales.js';
import userRouter from './routes/user.js';
import vyhodnoceniRouter from './routes/vyhodnoceni.js';
import barcodeRouter from './routes/barcode.js';
import vykazyRouter from './routes/vykazy.js';

//INIT
const app = express();
const port = process.env.PORT_API || 3001;

//MIDDLEWARE
app.use(
  cors({
    credentials: true,
    origin: [
      `${appSite}:3000`,
      `${appSite}:5000`,
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:5000',
      'https://localhost:5000',
      'http://pc128:5000',
      'https://pc128:5000',
      'http://pc128:3000',
      'http://pc-150:5000',
      'https://pc-150:5000',
      'http://pc-150:3000',
      'https://pc-150:3000',
    ],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

//ROUTING
app.use('/zamestnanci', employeesRouter);
app.use('/obchod', salesRouter);
app.use('/user', userRouter);
app.use('/vyhodnoceni', vyhodnoceniRouter);
app.use('/barcode', barcodeRouter);
app.use('/vykazy', vykazyRouter);

//DB AND SERVER
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose
  .connect(process.env.MONGO_URI_PROD, mongoConfig)
  .then(() => {
    app.listen(port, () =>
      console.log(
        `Mongo database connected and API server running on port ${port}`
      )
    );
  })
  .catch((err) => console.log(err.message));
