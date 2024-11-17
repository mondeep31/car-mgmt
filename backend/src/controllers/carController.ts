import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import path from 'path';
import { uploadToGCS } from '../middleware/multer';
const prisma = new PrismaClient();

export const createCar = async (req: Request, res: Response) => {
  try {
    const { title, description, tags } = req.body;
    
    let images: string[] = [];
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      // Upload all files and get their URLs
      images = await Promise.all(
        files.map(async (file) => {
          const url = await uploadToGCS(file);
          // Ensure the URL is absolute
          return url.startsWith('http') ? url : `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${url}`;
        })
      );
    }

    const car = await prisma.car.create({
      data: {
        title,
        description,
        tags,
        images,
        userId: req.userId!
      }
    });

    res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ 
      error: 'Could not create car',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCars = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    
    const where: Prisma.CarWhereInput = {
      userId: req.userId!,
      ...(search?.trim() && {
        OR: [
          {
            title: {
              contains: search.trim(),
              mode: 'insensitive' as Prisma.QueryMode
            }
          },
          {
            description: {
              contains: search.trim(),
              mode: 'insensitive' as Prisma.QueryMode
            }
          },
          {
            tags: {
              hasSome: [search.trim()]
            }
          }
        ]
      })
    };

    const cars = await prisma.car.findMany({ 
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Ensure all image URLs are absolute
    const carsWithAbsoluteUrls = cars.map(car => ({
      ...car,
      images: car.images.map(image => 
        image.startsWith('http') ? image : `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${image}`
      )
    }));

    res.json(carsWithAbsoluteUrls);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(400).json({ error: 'Could not fetch cars' });
  }
};

export const getCar = async (req: Request, res: Response) => {
  try {
    const car = await prisma.car.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.json(car);
  } catch (error) {

    res.status(400).json({ error: 'Could not fetch car' });
  }
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const { title, description, tags } = req.body;
        let images: string[] = [];
        if (req.files) {
          const files = req.files as Express.Multer.File[];
          images = await Promise.all(
            files.map(file => uploadToGCS(file))
          );
        }

        const carId = req.params.id;
        if (!carId || typeof carId !== 'string') {
            res.status(400).json({ error: 'Invalid car ID' });
            return;
        }


        let tagsArray: string[] = [];
        if (tags) {
            try {

                if (Array.isArray(tags)) {
                    tagsArray = tags;
                } else if (typeof tags === 'string') {

                    try {
                        tagsArray = JSON.parse(tags);
                    } catch {

                        tagsArray = tags.split(',').map(tag => tag.trim());
                    }
                }
            } catch (error) {

                res.status(400).json({ error: 'Invalid tags format' });
                return;
            }
        }


        const existingCar = await prisma.car.findFirst({
            where: {
                id: carId,
                userId: req.userId!
            }
        });

        if (!existingCar) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }


        const updateData: Prisma.CarUpdateInput = {
            ...(title && { title }),
            ...(description && { description }),
            ...(tags && { tags }),
            ...(images.length > 0 && { images })
        };


        const updatedCar = await prisma.car.update({
            where: { id: req.params.id},
            data: updateData
        });

        res.json(updatedCar);
        return;
    } catch (error) {

        res.status(400).json({ 
            error: 'Could not update car',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
export const deleteCar = async (req: Request, res: Response) => {
  try {
    const car = await prisma.car.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    await prisma.car.delete({
      where: { id: req.params.id }
    });

    res.status(204).send().json({
        message: "Car deleted successfully"
    });
  } catch (error) {

    res.status(400).json({ error: 'Could not delete car' });
  }
};