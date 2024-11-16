import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <LoadingSpinner />
      <p className="text-gray-600">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};