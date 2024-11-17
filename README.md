# Spyne Car Management System

A full-stack web application for managing car inventory with authentication, image uploads, and comprehensive car management features.

## 🌟 Features

- User Authentication (Login/Signup)
- Car Management (CRUD operations)
- Image Upload and Management
- Responsive Design
- Pagination
- Search and Filter Capabilities
- Error Handling and Loading States

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS & Shadcn UI for styling
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- MongoDB Database
- JWT Authentication
- Swagger/OpenAPI Documentation

## 🚀 Live Demo

- Frontend: [https://car-mgmt.vercel.app](https://car-mgmt.vercel.app)
- Backend: [https://team-mgmt-backend.el.r.appspot.com](https://team-mgmt-backend.el.r.appspot.com)
- API Documentation: [https://team-mgmt-backend.el.r.appspot.com/api/docs/](https://team-mgmt-backend.el.r.appspot.com/api/docs/)

## 💻 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Frontend Setup

1. Clone the repository:
```bash
git clone <repository_url>
cd <repository_directory>/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_BACKEND_URL=http://localhost:8080  # For development
# VITE_BACKEND_URL=https://team-mgmt-backend.el.r.appspot.com  # For production
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd ../backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="your_mongodb_connection_url"
JWT_SECRET="your_jwt_secret"
PORT=8080
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

## 📚 API Documentation

The API documentation is available at:
```
https://team-mgmt-backend.el.r.appspot.com/api/docs/
```

The documentation provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## 🔒 Environment Variables

### Frontend
- `VITE_BACKEND_URL`: Backend API URL

### Backend
- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port number

## 🛣️ Project Structure

### Frontend
```
frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── services/     # API service layer
│   ├── store/        # Redux store configuration
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript type definitions
```

### Backend
```
backend/
├── src/
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   └── utils/       # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
