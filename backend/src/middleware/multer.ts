// multer.ts
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import { Request } from 'express';
import path from 'path';

// Initialize storage without explicit credentials
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

const bucket = storage.bucket(process.env.BUCKET_NAME || 'team-mgmt-backend.appspot.com');

// Create a memory storage multer instance
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

// Helper function to upload to GCS
export const uploadToGCS = async (file: Express.Multer.File): Promise<string> => {
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    
    // Upload to Google Cloud Storage
    const blob = bucket.file(fileName);
    
    // Set predefined ACL to 'publicRead' when creating the file
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
      predefinedAcl: 'publicRead' // This ensures the file remains publicly accessible
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Upload error:', err);
        reject(err);
      });
      
      blobStream.on('finish', async () => {
        try {
          // Make sure the file is public and get its public URL
          await blob.makePublic();
          
          // Use a direct storage URL that doesn't require authentication
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve(publicUrl);
        } catch (err) {
          console.error('Error making blob public:', err);
          reject(err);
        }
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error('uploadToGCS error:', error);
    throw error;
  }
};

export { upload };