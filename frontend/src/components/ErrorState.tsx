// components/ErrorState.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong',
  onRetry,
  fullScreen = false,
}) => {
  const content = (
    <div className="text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
      <p className="text-gray-800 font-medium">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
