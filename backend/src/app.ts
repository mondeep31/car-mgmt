import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';
import docsRoutes from './routes/docsRoutes';
import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// More specific CORS configuration
const corsOptions = {
  origin: '*', // Replace with your frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600
};

app.use(cors(corsOptions));

// For preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Documentation route - no auth required
app.use('/api/docs', docsRoutes);

// Protected routes
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);

// error handling
app.use(errorHandler);

export default app;