// import { authService } from "@/services/api";
// import { SignupCredentials, User } from "@/types";
// import { LoginCredentials } from "@/types/auth";
// import React, { createContext, useContext, useState, useEffect } from "react";

// interface AuthContextType {
//   user: User | null;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   signup: (credentials: SignupCredentials) => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
    
//     if (token && storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Error parsing stored user:", error);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (credentials: LoginCredentials) => {
//     const response = await authService.login(credentials);
//     setUser(response.user);
//     localStorage.setItem("user", JSON.stringify(response.user));
//   };

//   const signup = async (credentials: SignupCredentials) => {
//     const response = await authService.signup(credentials);
//     setUser(response.user);
//     localStorage.setItem("user", JSON.stringify(response.user));
//   };

//   const logout = () => {
//     authService.logout();
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




import { authService } from "@/services/api";
import { SignupCredentials, User } from "@/types";
import { LoginCredentials } from "@/types";
import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const response = await authService.signup(credentials);
      if (response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};