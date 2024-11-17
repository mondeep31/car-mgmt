// Configuration object for the application
export const config = {
  // API configuration
  api: {
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
    uploadsURL: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}/uploads`,
  },
  
  // Authentication configuration
  auth: {
    tokenKey: 'authToken',
    userKey: 'user',
  },
};

export default config;
