
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.status(201).json({ user, token, message: "Signup Successful" });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error();
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({ message: "Login Successful" });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};