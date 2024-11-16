import { ChangeEvent } from "react";

export interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
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
    success?: boolean;
    token: string;
    user: User;
    message?: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupCredentials extends LoginCredentials {
    name?: string;
  }
  
  export interface CarFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    initialData?: Car;
  }

  export interface CarFormData {
    title: string;
    description: string;
    tags: string;
    images: FileList;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupCredentials {
    email: string;
    password: string;
    name?: string;
  }

  export interface ErrorResponse {
    message: string;
    status?: number;
  }