// components/ImageUploadPreview.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadPreviewProps {
  previewUrls: string[];
  onRemove: (index: number) => void;
  maxImages?: number;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  previewUrls,
  onRemove,
  maxImages = 10,
  onImageSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {previewUrls.length < maxImages && (
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <div className="text-center">
              <span className="block text-sm font-medium">Add Image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={onImageSelect}
              />
            </div>
          </label>
        )}
      </div>
      {previewUrls.length >= maxImages && (
        <p className="text-sm text-yellow-600">
          Maximum number of images ({maxImages}) reached
        </p>
      )}
    </div>
  );
};
