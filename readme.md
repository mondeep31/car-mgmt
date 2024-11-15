I'll create a full-stack project using React.js for the frontend, Node.js with Express.js for the backend, MongoDB for the database, TypeScript for type safety, and Tailwind CSS for styling. This project will be a car management application with user authentication, CRUD operations for cars, and search functionality.

Let's break this down into steps:

Let's begin with the project setup:

1. Project Structure:


```plaintext
 car-management-app/car-management-app/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── App.tsx
│       └── index.tsx
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── index.ts
│   └── tsconfig.json
├── .gitignore
└── package.json

```

2. Backend Setup:


First, let's set up the backend:

```shellscript
 mkdir car-management-appmkdir car-management-app
cd car-management-app
mkdir server
cd server
npm init -y
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
npm install --save-dev typescript @types/express @types/node @types/cors @types/jsonwebtoken @types/bcryptjs ts-node-dev

```

Now, let's create the necessary files for the backend:

a. `server/tsconfig.json`:

```json
 {{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}

```

b. `server/src/config/database.ts`:

```typescript
 import mongoose from 'mongoose';import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

```

c. `server/src/models/User.ts`:

```typescript
 import mongoose, { Document, Schema } from 'mongoose';import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);

```

d. `server/src/models/Car.ts`:

```typescript
 import mongoose, { Document, Schema } from 'mongoose';import mongoose, { Document, Schema } from 'mongoose';

export interface ICar extends Document {
  title: string;
  description: string;
  images: string[];
  tags: {
    car_type: string;
    company: string;
    dealer: string;
  };
  user: mongoose.Types.ObjectId;
}

const CarSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  tags: {
    car_type: { type: String, required: true },
    company: { type: String, required: true },
    dealer: { type: String, required: true },
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<ICar>('Car', CarSchema);

```

e. `server/src/middleware/auth.ts`:

```typescript
 import { Request, Response, NextFunction } from 'express';import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string };
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;

```

f. `server/src/controllers/authController.ts`:

```typescript
 import { Request, Response } from 'express';import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

```

g. `server/src/controllers/carController.ts`:

```typescript
 import { Request, Response } from 'express';import { Request, Response } from 'express';
import Car from '../models/Car';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createCar = async (req: AuthRequest, res: Response) => {
  try {
    const newCar = new Car({
      ...req.body,
      user: req.user?.id,
    });

    const car = await newCar.save();
    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const getCars = async (req: AuthRequest, res: Response) => {
  try {
    const cars = await Car.find({ user: req.user?.id });
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const getCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const updateCar = async (req: AuthRequest, res: Response) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    if (car.user.toString() !== req.user?.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const deleteCar = async (req: AuthRequest, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    if (car.user.toString() !== req.user?.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await car.remove();
    res.json({ msg: 'Car removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const searchCars = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    const cars = await Car.find({
      user: req.user?.id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'tags.car_type': { $regex: query, $options: 'i' } },
        { 'tags.company': { $regex: query, $options: 'i' } },
        { 'tags.dealer': { $regex: query, $options: 'i' } },
      ],
    });
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

```

h. `server/src/routes/auth.ts`:

```typescript
 import express from 'express';import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;

```

i. `server/src/routes/cars.ts`:

```typescript
 import express from 'express';import express from 'express';
import { createCar, getCars, getCar, updateCar, deleteCar, searchCars } from '../controllers/carController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createCar);
router.get('/', auth, getCars);
router.get('/search', auth, searchCars);
router.get('/:id', auth, getCar);
router.put('/:id', auth, updateCar);
router.delete('/:id', auth, deleteCar);

export default router;

```

j. `server/src/index.ts`:

```typescript
 import express from 'express';import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

Now that we have set up the backend, let's move on to the frontend:

3. Frontend Setup:


```shellscript
 cd ..cd ..
npx create-react-app client --template typescript
cd client
npm install axios react-router-dom @types/react-router-dom tailwindcss @headlessui/react @heroicons/react
npx tailwindcss init -p

```

Now, let's create the necessary files for the frontend:

a. `client/src/index.css`:

```css
 @import 'tailwindcss/base';@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

```

b. `client/tailwind.config.js`:

```javascript
 module.exports = {module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

c. `client/src/types/index.ts`:

```typescript
 export interface User {export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Car {
  _id: string;
  title: string;
  description: string;
  images: string[];
  tags: {
    car_type: string;
    company: string;
    dealer: string;
  };
  user: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
}

export interface CarState {
  cars: Car[];
  currentCar: Car | null;
  loading: boolean;
  error: string | null;
}

```

d. `client/src/services/api.ts`:

```typescript
 import axios from 'axios';import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

```

e. `client/src/components/Header.tsx`:

```typescriptreact
 import React from 'react';import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Car Management
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/cars" className="mr-4">
                My Cars
              </Link>
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

```

f. `client/src/components/CarForm.tsx`:

```typescriptreact
 import React, { useState } from 'react';import React, { useState } from 'react';
import { Car } from '../types';

interface CarFormProps {
  onSubmit: (carData: Partial<Car>) => void;
  initialData?: Car;
}

const CarForm: React.FC<CarFormProps> = ({ onSubmit, initialData }) => {
  const [carData, setCarData] = useState<Partial<Car>>(
    initialData || {
      title: '',
      description: '',
      images: [],
      tags: {
        car_type: '',
        company: '',
        dealer: '',
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in carData.tags!) {
      setCarData({
        ...carData,
        tags: {
          ...carData.tags!,
          [name]: value,
        },
      });
    } else {
      setCarData({ ...carData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(carData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={carData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={carData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="car_type" className="block text-sm font-medium text-gray-700">
          Car Type
        </label>
        <input
          type="text"
          id="car_type"
          name="car_type"
          value={carData.tags?.car_type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={carData.tags?.company}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="dealer" className="block text-sm font-medium text-gray-700">
          Dealer
        </label>
        <input
          type="text"
          id="dealer"
          name="dealer"
          value={carData.tags?.dealer}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialData ? 'Update Car' : 'Add Car'}
      </button>
    </form>
  );
};

export default CarForm;

```

g. `client/src/components/CarCard.tsx`:

```typescriptreact
 import React from 'react';import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={car.images[0]} alt={car.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
        <p className="text-gray-600 mb-4">{car.description.substring(0, 100)}...</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {car.tags.car_type}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {car.tags.company}
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {car.tags.dealer}
          </span>
        </div>
        <Link
          to={`/cars/${car._id}`}
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CarCard;

```

h. `client/src/context/AuthContext.tsx`:

```typescriptreact
 import React, { createContext, useContext, useState, useEffect } from 'react';import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { AuthState, User } from '../types';

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (authState.token) {
        try {
          const res = await api.get('/auth');
          setAuthState({
            ...authState,
            isAuthenticated: true,
            loading: false,
            user: res.data,
          });
        } catch (err) {
          localStorage.removeItem('token');
          setAuthState({
            ...authState,
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
            error: 'Token is not valid',
          });
        }
      } else {
        setAuthState({
          ...authState,
          isAuthenticated: false,
          loading: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAuthState({
        ...authState,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        user: res.data.user,
        error: null,
      });
    } catch (err) {
      setAuthState({
        ...authState,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: 'Invalid credentials',
      });
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      setAuthState({
        ...authState,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        user: res.data.user,
        error: null,
      });
    } catch (err) {
      setAuthState({
        ...authState,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: 'Registration failed',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

```

i. `client/src/pages/Home.tsx`:

```typescriptreact
 import React from 'react';import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Car Management</h1>
      {authState.isAuthenticated ? (
        <div>
          <p className="mb-4">Hello, {authState.user?.username}!</p>
          <Link
            to="/cars"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            View My Cars
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-4">Please log in or register to manage your cars.</p>
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

```

j. `client/src/pages/Login.tsx`:

```typescriptreact
 import React, { useState } from 'react';import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, authState } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (authState.isAuthenticated) {
      navigate('/cars');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

```

k. `client/src/pages/Register.tsx`:

```typescriptreact
 import React, { useState } from 'react';import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, authState } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(username, email, password);
    if (authState.isAuthenticated) {
      navigate('/cars');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Register</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

```

l. `client/src/pages/Cars.tsx`:

```typescriptreact
 import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/CarCard';
import { Car } from '../types';

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get(`/cars/search?query=${search}`);
      setCars(response.data);
    } catch (error) {
      console.error('Error searching cars:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Cars</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="flex-grow shadow appearance-none border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
          >
            Search
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
      {cars.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No cars found. Add a new car to get started!</p>
      )}
      <div className="mt-8 text-center">
        <Link
          to="/cars/create"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add New Car
        </Link>
      </div>
    </div>
  );
};

export default Cars;

```

m. `client/src/pages/CreateCar.tsx`:

```typescriptreact
 import React from 'react';import React from 'react';
import { useNavigate } from 'react-router-dom';
import CarForm from '../components/CarForm';
import api from '../services/api';
import { Car } from '../types';

const CreateCar: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (carData: Partial<Car>) => {
    try {
      await api.post('/cars', carData);
      navigate('/cars');
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Car</h1>
      <CarForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCar;

```

n. `client/src/pages/CarDetails.tsx`:

```typescriptreact
 import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Car } from '../types';

const CarDetails: React.FC = () => {
  const [car, setCar] = useState<Car | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await api.get(`/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car details:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await api.delete(`/cars/${id}`);
        navigate('/cars');
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{car.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={car.images[0]} alt={car.title} className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div>
          <p className="text-gray-700 mb-4">{car.description}</p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Tags:</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                {car.tags.car_type}
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                {car.tags.company}
              </span>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                {car.tags.dealer}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/cars/${id}/edit`)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;

```

o. `client/src/pages/EditCar.tsx`:

```typescriptreact
 import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CarForm from '../components/CarForm';
import api from '../services/api';
import { Car } from '../types';

const EditCar: React.FC = () => {
  const [car, setCar] = useState<Car | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await api.get(`/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car details:', error);
    }
  };

  const handleSubmit = async (carData: Partial<Car>) => {
    try {
      await api.put(`/cars/${id}`, carData);
      navigate(`/cars/${id}`);
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Car</h1>
      <CarForm onSubmit={handleSubmit} initialData={car} />
    </div>
  );
};

export default EditCar;

```

p. `client/src/App.tsx`:

```typescriptreact
 import React from 'react';import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import CreateCar from './pages/CreateCar';
import CarDetails from './pages/CarDetails';
import EditCar from './pages/EditCar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/create" element={<CreateCar />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/cars/:id/edit" element={<EditCar />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

```

Finally, update the `client/src/index.tsx` file:

```typescriptreact
 import React from 'react';import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

```

This completes the setup for both the backend and frontend of your car management application. To run the application:

1. Start the backend server:

```plaintext
 cd servercd server
npm run dev

```


2. Start the frontend development server:

```plaintext
 cd clientcd client
npm start

```




The application should now be running with a React.js frontend, Node.js + Express.js backend, MongoDB database, TypeScript for type safety, and Tailwind CSS for styling. Users can register, log in, and perform CRUD operations on their car listings with search functionality.