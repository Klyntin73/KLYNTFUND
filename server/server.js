import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import userRouter from './routes/userRoute.js';
import investmentRouter from './routes/investmentRoute.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
connectDB();

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];

const corsOptions = {
   origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   },
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   credentials: true,
   allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


// Body parser
app.use(express.json());
// app.use(cors());

// API EndPoints
app.use('/api/user', userRouter);
app.use('/api/investments', investmentRouter);
app.use('/api/admin', adminRouter);

// Server start
app.listen(port, () => {
   console.log(`Server Listening on ${port}`);
});
