// Environment configuration is now managed in config/config.ts
export const env = {

    BACKEND_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  };