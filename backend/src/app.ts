
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';
import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// serving static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// error handling
app.use(errorHandler);
//routes
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);




export default app;