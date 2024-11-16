// import { LoginCredentials, SignupCredentials, Car, AuthResponse } from "@/types";
// import axios from "axios";


// const api = axios.create({
//     baseURL: 'http://localhost:3000'
// })

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const authService = {
//   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
//     try {
//       const response = await api.post<AuthResponse>('/auth/login', credentials);
//       if (!response.data.token || !response.data.user) {
//         throw new Error('Invalid response from server');
//       }
//       return response.data;
//     } catch (error) {
//       console.error('Login request failed:', error);
//       throw error;
//     }
//   },
//   signup: async (credentials: SignupCredentials) => {
//     const response = await api.post<AuthResponse>('/auth/signup', credentials);
//     localStorage.setItem('token', response.data.token);
//     return response.data;
//   },
//   logout: () => {
//     localStorage.removeItem('token');
//   },
// };

// api.ts
// services/api.ts
import { LoginCredentials, SignupCredentials, AuthResponse, ErrorResponse, Car } from "@/types";
import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Log the response for debugging
      console.log('Server response:', response.data);
      
      if (response.data.message === 'Login Successful') {
        // If the server only returns a success message, create a basic user object
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
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', credentials);
      
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid signup response from server');
      }
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message);
      }
      throw new Error('Signup failed. Please try again.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const carService = {
  getAllCars: async (search?: string) => {
    const params = search ? { search } : undefined;
    return api.get<Car[]>('/cars', { params }).then((res) => res.data);
  },
  getCarById: async (id: string) => {
    return api.get<Car>(`/cars/${id}`).then((res) => res.data);
  },
  createCar: async (formData: FormData) => {
    return api.post<Car>('/cars', formData).then((res) => res.data);
  },
  updateCar: async (id: string, formData: FormData) => {
    return api.put<Car>(`/cars/${id}`, formData).then((res) => res.data);
  },
  deleteCar: async (id: string) => {
    return api.delete(`/cars/${id}`);
  },
}
