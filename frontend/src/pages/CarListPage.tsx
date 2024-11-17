import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { carService } from "@/services/api";
import { Car } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { AppError, ErrorCodes } from "@/types/error";
import { useToast } from "@/hooks/use-toast";

export const CarListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const debouncedSearchTerm = useDebounce(search, 300);
  const initialRequestMade = useRef(false);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof AppError) {
      switch (error.code) {
        case ErrorCodes.UNAUTHORIZED:
          toast({
            title: "Session Expired",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          navigate("/login");
          break;
        case ErrorCodes.NOT_FOUND:
          toast({
            title: "Not Found",
            description: error.message,
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
      }
    } else if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setError(error instanceof Error ? error.message : "An unexpected error occurred");
  }, [navigate, toast]);

  const loadCars = useCallback(async (searchTerm?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await carService.getAllCars(searchTerm || undefined);
      setCars(data);
    } catch (error) {
      handleError(error);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);
  
  useEffect(() => {
    if (!initialRequestMade.current || debouncedSearchTerm) {
      loadCars(debouncedSearchTerm);
      initialRequestMade.current = true;
    }
  }, [debouncedSearchTerm, loadCars]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await carService.deleteCar(id);
      setCars(cars.filter((car) => car.id !== id));
      toast({
        title: "Success",
        description: "Car deleted successfully",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 text-lg font-medium">Error Loading Cars</h2>
          <p className="text-red-600 mt-1">{error}</p>
          <Button 
            onClick={() => loadCars(debouncedSearchTerm)}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Input
          type="search"
          placeholder="Search cars..."
          value={search}
          onChange={handleSearch}
          className="max-w-md"
          disabled={isLoading}
        />
        <Button onClick={() => navigate("/cars/new")} disabled={isLoading}>Add New Car</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onDelete={handleDelete}
              disabled={isLoading}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No cars found</p>
        </div>
      )}
    </div>
  );
};

export default CarListPage;
