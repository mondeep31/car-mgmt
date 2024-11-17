import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { CarListPage } from "./pages/CarListPage";
import { CarFormPage } from "./pages/CarFormPage";
import { CarDetailPage } from "./pages/CarDetailPage";
import { Toaster } from "@/components/ui/toaster";

// Protected Route: Only accessible when logged in
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Auth Route: Only accessible when NOT logged in
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    // Redirect to /cars if user is already logged in
    return <Navigate to="/cars" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Default route */}
            <Route 
              path="/" 
              element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              } 
            />

            {/* Auth routes - only accessible when NOT logged in */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              }
            />

            {/* Protected routes - only accessible when logged in */}
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

            {/* Catch-all route - redirect to cars if logged in, signup if not */}
            <Route
              path="*"
              element={
                <AuthRoute>
                  <Navigate to="/signup" replace />
                </AuthRoute>
              }
            />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
