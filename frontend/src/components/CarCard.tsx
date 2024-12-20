import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car } from "@/types";
import { useNavigate } from "react-router-dom";
import { config } from "@/config/config";

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onDelete, disabled = false }) => {
  const navigate = useNavigate();

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${config.api.uploadsURL}/${imagePath}`; 
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{car.title}</span>
          <div className="space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/cars/${car.id}/edit`)}
              disabled={disabled}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(car.id)}
              disabled={disabled}
            >
              Delete
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          <img
            src={car.images[0] ? getImageUrl(car.images[0]) : '/placeholder-car.jpg'}
            alt={car.title}
            className="object-cover w-full h-full"
            onError={(e) => {

              e.currentTarget.src = '/placeholder-car.jpg';
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">{car.description}</p>
        <div className="flex flex-wrap gap-2">
          {car.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/cars/${car.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
