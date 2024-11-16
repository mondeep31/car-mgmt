// pages/CarListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarCard } from '@/components/CarCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { carService } from '@/services/api';
import { Car } from '@/types';
import debounce from 'lodash/debounce';

export const CarListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadCars = async (searchTerm?: string) => {
    try {
      const data = await carService.getAllCars(searchTerm);
      setCars(data);
    } catch (error) {
      console.error('Failed to load cars:', error);
    }
  };

  const debouncedSearch = debounce((term: string) => {
    loadCars(term);
  }, 300);

  useEffect(() => {
    loadCars();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    debouncedSearch(term);
  };

  const handleDelete = async (id: string) => {
    try {
      await carService.deleteCar(id);
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Input
          type="search"
          placeholder="Search cars..."
          value={search}
          onChange={handleSearch}
          className="max-w-md"
        />
        <Button onClick={() => navigate('/cars/new')}>
          Add New Car
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};