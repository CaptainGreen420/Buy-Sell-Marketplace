import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import productRouter from './routes/productRoute.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
connectDB();

//require('dotenv').config(); // Ensure dotenv is loaded
console.log("Loaded API Key at startup:", process.env.GEMINI_API_KEY);


app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));