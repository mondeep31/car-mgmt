export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Car {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}
