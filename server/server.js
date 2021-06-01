import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import pool from './utils/mssql.js';

//ROUTES IMPORT
import zamestnanciRoutes from './routes/zamestnanci.js';

//INIT
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

//MIDDLEWARE

app.use(cors());

app.use('/zamestnanci', zamestnanciRoutes);

//DB AND SERVER

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGO_URI, mongoConfig)
  .then(() =>
    app.listen(port, () =>
      console.log(`Mongo database connected and server running on port ${port}`)
    )
  )
  .catch((err) => console.log(err.message));
