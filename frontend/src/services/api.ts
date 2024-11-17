import { LoginCredentials, SignupCredentials, AuthResponse, Car } from "@/types";
import { AppError, ErrorCodes } from "@/types/error";
import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: 'https://team-mgmt-backend.el.r.appspot.com',
  // baseURL: 'http://localhost:8080',
  timeout: 10000, // 10 second timeout
});

const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    switch (status) {
      case 401:
        throw new AppError(
          data?.message || 'Your session has expired. Please log in again.',
          ErrorCodes.UNAUTHORIZED,
          status
        );
      case 404:
        throw new AppError(
          data?.message || 'Resource not found',
          ErrorCodes.NOT_FOUND,
          status
        );
      case 422:
        throw new AppError(
          data?.message || 'Validation error',
          ErrorCodes.VALIDATION_ERROR,
          status,
          data?.errors
        );
      case 500:
        throw new AppError(
          'Internal server error',
          ErrorCodes.SERVER_ERROR,
          status
        );
      default:
        if (!error.response) {
          throw new AppError(
            'Network error. Please check your connection.',
            ErrorCodes.NETWORK_ERROR
          );
        }
        throw new AppError(
          data?.message || 'An unexpected error occurred',
          ErrorCodes.UNKNOWN_ERROR,
          status
        );
    }
  }
  
  throw new AppError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    ErrorCodes.UNKNOWN_ERROR
  );
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);

      console.log('Server response:', response.data);
      
      if (response.data.message === 'Login Successful') {
        
        if (!response.data.token || !response.data.user) {
          return {
            token: localStorage.getItem('token') || 'temporary-token',
            user: {
              id: 'temp-id',
              email: credentials.email
            },
            message: response.data.message
          };
        }
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', credentials);
      localStorage.setItem('token', response.data.token);
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid signup response from server');
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const carService = {
  getAllCars: async (search?: string) => {
    try {
      const params = search ? { search } : undefined;
      const response = await api.get<Car[]>('/cars', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getCarById: async (id: string) => {
    try {
      const response = await api.get<Car>(`/cars/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  createCar: async (formData: FormData) => {
    try {
      const response = await api.post<Car>('/cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  updateCar: async (id: string, formData: FormData) => {
    try {
      const response = await api.put<Car>(`/cars/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  deleteCar: async (id: string) => {
    try {
      await api.delete(`/cars/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
