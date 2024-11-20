import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component to protect routes by checking user authentication status
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Retrieve the current user from AuthContext

  // If no user is authenticated, redirect to the login page
  if (!user) {
    return <Navigate to='/login' />;
  }

  // If the user is authenticated, render the child components
  return children;
};

export default ProtectedRoute;