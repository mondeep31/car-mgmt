// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';
import {Request, Response, NextFunction, ErrorRequestHandler} from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory using absolute path
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/auth', authRoutes);
app.use('/cars', carRoutes);

// Global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', err); // Log error details
  if (err instanceof multer.MulterError) {
    res.status(400).json({ 
      error: 'File upload error',
      details: err.message
    });
    return;
  }
  res.status(500).json({ error: 'Something went wrong!' });
  return;
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});