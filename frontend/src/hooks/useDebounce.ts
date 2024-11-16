// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if the effect re-runs
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect if `value` or `delay` changes

  return debouncedValue;
}
