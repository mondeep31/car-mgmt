import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  signup: async (credentials: SignupCredentials) => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
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
};
