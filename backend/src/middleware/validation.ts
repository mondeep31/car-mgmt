import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

// MongoDB ObjectId validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId format');

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    userSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
};

// Helper function to parse tags
const parseTagsString = (tagsInput: unknown): string[] => {
    if (Array.isArray(tagsInput)) {
      return tagsInput.map(String);
    }
    
    if (typeof tagsInput === 'string') {
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(tagsInput);
        if (Array.isArray(parsed)) {
          return parsed.map(String);
        }
      } catch {
        // If JSON parsing fails, split by comma
        return tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }
    
    return [];
  };
  
  const carSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    tags: z
      .any()
      .transform(parseTagsString)
      .pipe(z.array(z.string()))
      .optional()
      .default([])
  });
  
  // For updates, make all fields optional
  const carUpdateSchema = carSchema.partial();
  
  export const validateCar = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = req.method === 'PUT' ? carUpdateSchema : carSchema;
      const validatedData = schema.parse(req.body);
      
      // Update request body with validated data
      req.body = validatedData;
      
      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(400).json({ 
        error: 'Invalid input',
        details: error instanceof z.ZodError ? error.errors : String(error)
      });
    }
  };