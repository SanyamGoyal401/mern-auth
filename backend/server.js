import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../.env')});

import {connectDB} from './config/db.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

console.log(process.env.NODE_ENV)
const port = process.env.PORT || 5000;

import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
app.use('/api/users', userRoutes);

app.get("/", (req, res)=>{
    res.send('Server is live');
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
})