import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car } from '@/types';
import { carService } from '@/services/api';
import { AppError } from '@/types/error';

interface CarState {
  cars: Car[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: CarState = {
  cars: [],
  isLoading: false,
  error: null,
  searchTerm: '',
};

export const fetchCars = createAsyncThunk(
  'car/fetchCars',
  async (searchTerm: string | undefined, { rejectWithValue }) => {
    try {
      return await carService.getAllCars(searchTerm);
    } catch (error) {
      if (error instanceof AppError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const deleteCar = createAsyncThunk(
  'car/deleteCar',
  async (id: string, { rejectWithValue }) => {
    try {
      await carService.deleteCar(id);
      return id;
    } catch (error) {
      if (error instanceof AppError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = state.cars.filter(car => car.id !== action.payload);
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, clearError } = carSlice.actions;
export default carSlice.reducer;
