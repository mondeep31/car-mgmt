import {Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import multer from 'multer';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // Log the full error stack trace
    console.error('Global Error Handler:', {
      error: err,
      stack: err.stack,
      body: req.body,
      files: req.files,
      path: req.path,
      method: req.method
    }); 

    if (err instanceof multer.MulterError) {
      res.status(400).json({ 
        error: 'File upload error',
        details: err.message
      });
      return;
    }

    // Handle Prisma errors
    if (err.code && err.code.startsWith('P')) {
      res.status(400).json({ 
        error: 'Database error',
        details: err.message,
        code: err.code
      });
      return;
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      res.status(400).json({ 
        error: 'Validation error',
        details: err.message
      });
      return;
    }

    // Handle all other errors
    res.status(500).json({ 
      error: 'Something went wrong!',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
    return;
  };