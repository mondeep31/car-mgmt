import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types';
import { useNavigate } from 'react-router-dom';

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onDelete }) => {
  const navigate = useNavigate();

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
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(car.id)}
            >
              Delete
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          <img
            src={car.images[0]}
            alt={car.title}
            className="object-cover w-full h-full"
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