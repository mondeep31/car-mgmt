import express from 'express';
import { signup, login } from '../controllers/authController';
import { validateUser } from '../middleware/validation';

const router = express.Router();

router.post('/signup', validateUser, signup);
router.post('/login', login);

export default router;