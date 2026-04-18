import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Headers from "../pages/layouts/headers";
import { SyncLoader } from "react-spinners";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SyncLoader color="#1076fc" loading={loading} size={50} />
      </div>
    );
  }

  return isAuthenticated ? (
     <Headers>
      <Outlet />
    </Headers>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
