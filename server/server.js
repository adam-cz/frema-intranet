import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

//ROUTES IMPORT
import employeesRouter from './routes/employees.js';

//INIT
const app = express();
const port = process.env.PORT_API || 3001;

//MIDDLEWARE
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());

//ROUTING
app.use('/zamestnanci', employeesRouter);

//DB AND SERVER
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

mongoose.set('useFindAndModify', false);
