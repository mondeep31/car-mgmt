import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchCars, deleteCar, setSearchTerm, clearError } from "@/store/carSlice";
import { ErrorCodes, AppError } from "@/types/error";

export const CarListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { cars, isLoading, error, searchTerm } = useAppSelector((state) => state.car);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleError = (error: unknown) => {
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
        default:
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
      }
    }
  };

  useEffect(() => {
    dispatch(fetchCars(debouncedSearchTerm))
      .unwrap()
      .catch(handleError);
  }, [debouncedSearchTerm, dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCar(id)).unwrap();
      toast({
        title: "Success",
        description: "Car deleted successfully",
      });
    } catch (error) {
      handleError(error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 text-lg font-medium">Error Loading Cars</h2>
          <p className="text-red-600 mt-1">{error}</p>
          <Button 
            onClick={() => {
              dispatch(clearError());
              dispatch(fetchCars(debouncedSearchTerm));
            }}
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
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
          disabled={isLoading}
        />
        <Button onClick={() => navigate("/cars/new")} disabled={isLoading}>
          Add New Car
        </Button>
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