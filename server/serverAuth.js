import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { appSite } from './config/server.js';

//IMPORT ROUTES
import userRouter from './routes/user.js';

//INIT
const app = express();
const port = process.env.PORT_AUTH || 3001;

//MIDDLEWARE
app.use(cors({ credentials: true, origin: `${appSite}:3000` }));
app.use(cookieParser());
app.use(express.json());

//ROUTING
app.use('/user', userRouter);

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
        `Mongo database connected and AUTH server running on port ${port}`
      )
    )
  )
  .catch((err) => console.log(err.message));

mongoose.set('useFindAndModify', false);
