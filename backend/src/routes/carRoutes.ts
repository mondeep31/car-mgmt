import express from 'express';

import { createCar, getCars, getCar, updateCar, deleteCar } from '../controllers/carController';
import { auth } from '../middleware/auth';
import { validateCar } from '../middleware/validation';
import { upload } from '../middleware/multer';

const router = express.Router();

router.post('/', auth, upload.array('images', 10), validateCar, createCar);
router.get('/', auth, getCars);
router.get('/:id', auth, getCar);
router.put('/:id', auth, upload.array('images', 10), validateCar, updateCar);
router.delete('/:id', auth, deleteCar);

export default router;