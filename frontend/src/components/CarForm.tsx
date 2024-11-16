// components/CarForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Car } from '@/types';

interface CarFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Car;
}

export const CarForm: React.FC<CarFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  const onFormSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('tags', JSON.stringify(data.tags.split(',').map((t: string) => t.trim())));
    
    if (data.images) {
      Array.from(data.images).forEach((file: File) => {
        formData.append('images', file);
      });
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('title', { required: 'Title is required' })}
          placeholder="Car Title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          {...register('description', { required: 'Description is required' })}
          placeholder="Car Description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('tags', { required: 'Tags are required' })}
          placeholder="Tags (comma separated)"
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
        )}
      </div>

      <div>
        <Input
          type="file"
          multiple
          accept="image/*"
          {...register('images')}
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Car' : 'Create Car'}
      </Button>
    </form>
  );
};
