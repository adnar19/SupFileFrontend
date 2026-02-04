import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../pages/layouts/navbar';
import { SyncLoader } from 'react-spinners';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading, isAuthorized } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SyncLoader color="#1076fc" loading={loading} size={50} />
      </div>
    );
  }

  return isAuthenticated && isAuthorized ? (
    <Navbar/>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;