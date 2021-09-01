import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { appSite } from './config/server.js';

//CRONE IMPORT
import './utils/cron.js';

//ROUTES IMPORT
import employeesRouter from './routes/employees.js';
import salesRouter from './routes/sales.js';
import userRouter from './routes/user.js';
import orderRouter from './routes/order.js';
import barcodeRouter from './routes/barcode.js';

//INIT
const app = express();
const port = process.env.PORT_API || 3001;

//MIDDLEWARE
app.use(cors({ credentials: true, origin: `${appSite}:3000` }));
app.use(cors({ credentials: true, origin: `${appSite}:5000` }));
app.use(cookieParser());
app.use(express.json());

//ROUTING
app.use('/zamestnanci', employeesRouter);
app.use('/obchod', salesRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter);
app.use('/barcode', barcodeRouter);

//DB AND SERVER
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose
  .connect(process.env.MONGO_URI, mongoConfig)
  .then(() =>
    app.listen(port, () =>
      console.log(
        `Mongo database connected and API server running on port ${port}`
      )
    )
  )
  .catch((err) => console.log(err.message));
