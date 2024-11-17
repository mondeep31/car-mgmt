import React from "react";
import { useAuth } from '../context/authContext';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div>
      <header className="bg-gray-100 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={() => navigate("/cars")}
            >
              Car Management
            </h1>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user.name}</span>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
