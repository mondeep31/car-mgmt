import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { carService } from "@/services/api";
import { Car } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

export const CarListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(search, 300);

  const loadCars = useCallback(async (searchTerm?: string) => {
    try {
      const data = await carService.getAllCars(searchTerm);
      setCars(data);
    } catch (error) {
      console.error("Failed to load cars: ", error);
    }
  }, []);

  useEffect(() => {
    loadCars(debouncedSearchTerm);
  }, [debouncedSearchTerm, loadCars]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id: string) => {
    try {
      await carService.deleteCar(id);
      setCars(cars.filter((car) => car.id !== id));
    } catch (error) {
      console.error("Failed to delete car:", error);
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
        <Button onClick={() => navigate("/cars/new")}>Add New Car</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default CarListPage;
