import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createCar = async (req: Request, res: Response) => {
  try {
    const { title, description, tags } = req.body;
    const images = (req.files as Express.Multer.File[])?.map(file => file.path) || [];


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
    res.status(400).json({ 
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
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode
            }
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode
            }
          },
          {
            tags: {
              hasSome: [search]
            }
          }
        ]
      })
    };

    const cars = await prisma.car.findMany({ where });
    res.json(cars);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(400).json({ error: 'Could not fetch car' });
  }
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const { title, description, tags } = req.body;
        const images = (req.files as Express.Multer.File[])?.map(file => file.path);
        

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
                console.error('Error parsing tags:', error);
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
            tags: tagsArray,
            ...(images && images.length > 0 && { images })
        };


        const updatedCar = await prisma.car.update({
            where: { id: carId },
            data: updateData
        });

        res.json(updatedCar);
        return;
    } catch (error) {
        console.error('Update error:', error);
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
    console.error(error);
    res.status(400).json({ error: 'Could not delete car' });
  }
};