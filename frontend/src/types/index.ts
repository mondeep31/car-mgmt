import { ChangeEvent } from "react";

export interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }
  
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
  