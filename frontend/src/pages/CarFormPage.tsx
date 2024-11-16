
// pages/CarFormPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService } from '@/services/api';
import { CarForm } from '@/components/CarForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Car } from '@/types';

export const CarFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const loadCar = async () => {
      if (id) {
        try {
          const data = await carService.getCarById(id);
          setCar(data);
        } catch (error) {
          console.error('Failed to load car:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCar();
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    try {
      if (id) {
        await carService.updateCar(id, formData);
      } else {
        await carService.createCar(formData);
      }
      navigate('/cars');
    } catch (error) {
      console.error('Failed to save car:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{id ? 'Edit Car' : 'Add New Car'}</CardTitle>
        </CardHeader>
        <CardContent>
          <CarForm onSubmit={handleSubmit} initialData={car ?? undefined} />
        </CardContent>
      </Card>
    </div>
  );
};
