import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

// Create a React Query client instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap application in BrowserRouter for routing */}
    <BrowserRouter>
      {/* Provide authentication context to the entire app */}
      <AuthProvider> 
        {/* Provide React Query context to the app */}
        <QueryClientProvider client={queryClient}>
          {/* Main application component */}
          <App />
          {/* Add React Query Devtools for development and debugging */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);