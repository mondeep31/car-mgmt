// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CarListPage } from './pages/CarListPage';
import { CarDetailPage } from './pages/CarDetailPage';
import { CarFormPage } from './pages/CarFormPage';
import { Toaster } from '@/components/ui/toaster';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/cars"
              element={
                <ProtectedRoute>
                  <CarListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cars/new"
              element={
                <ProtectedRoute>
                  <CarFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cars/:id"
              element={
                <ProtectedRoute>
                  <CarDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cars/:id/edit"
              element={
                <ProtectedRoute>
                  <CarFormPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/cars" />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;