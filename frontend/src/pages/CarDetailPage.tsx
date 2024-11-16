import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselPrevious,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { carService } from "@/services/api";
import { Car } from "@/types";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      try {
        if (id) {
          const data = await carService.getCarById(id);
          setCar(data);
        }
      } catch (error) {
        console.error("Failed to load car: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadCar();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await carService.deleteCar(id);
        navigate("/cars");
      }
    } catch (error) {
      console.error("Failed to delete car:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Car not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{car.title}</CardTitle>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/cars/${id}/edit`)}
              >
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this car and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {car.images.length > 0 && (
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {car.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${car.title} - Image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Description</h3>
              <p className="text-gray-600">{car.description}</p>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {car.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>Created: {new Date(car.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(car.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarDetailPage;
