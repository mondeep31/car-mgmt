
import { useToast } from '@/hooks/use-toast';

export const useCustomToast = () => {
  const { toast } = useToast();

  const showSuccess = (message: string) => {
    toast({
      title: 'Success',
      description: message,
      duration: 3000,
    });
  };

  const showError = (message: string) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
      duration: 5000,
    });
  };

  return { showSuccess, showError };
};