
import { useState, useCallback } from 'react';

interface UseImageUploadReturn {
  previewUrls: string[];
  handleImageChange: (files: FileList | null) => void;
  selectedFiles: File[];
  removeImage: (index: number) => void;
  clearImages: () => void;
}

export const useImageUpload = (maxImages: number = 10): UseImageUploadReturn => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.slice(0, maxImages - selectedFiles.length);

    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  }, [selectedFiles.length, maxImages]);

  const removeImage = useCallback((index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  }, [previewUrls]);

  const clearImages = useCallback(() => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  }, [previewUrls]);

  return {
    previewUrls,
    handleImageChange,
    selectedFiles,
    removeImage,
    clearImages
  };
};