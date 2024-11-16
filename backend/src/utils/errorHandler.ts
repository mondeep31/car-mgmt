import {Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import multer from 'multer';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error('Global Error Handler:', err); 
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
  