
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { CarListPage } from "./pages/CarListPage";
import { CarDetailPage } from "./pages/CarDetailPage";
import { CarFormPage } from "./pages/CarFormPage";
import { Toaster } from "@/components/ui/toaster";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />

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
