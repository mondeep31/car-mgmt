import { CarForm } from "@/components/CarForm";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { carService } from "@/services/api";
import { Car } from "@/types";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
          console.error("Failed to load car:", error);
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
      navigate("/cars");
    } catch (error) {
      console.error("Failed to save car:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{id ? "Edit Car" : "Add New Car"}</CardTitle>
        </CardHeader>
        <CardContent>
          <CarForm onSubmit={handleSubmit} initialData={car ?? undefined} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CarFormPage;
