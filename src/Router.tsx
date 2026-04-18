import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/not-found";
import LoginPage from "./pages/Auth/login";
import RegisterPage from "./pages/Auth/sign_up";
import Dashboard from "./pages/Dashboard/home";
import PrivateRoute from "./components/PrivateRoute";
import Recent from "./pages/Dashboard/recent";
import Favorites from "./pages/Dashboard/favorites";
import Trash from "./pages/Dashboard/trash";
import AccountSettings from "./pages/Auth/account_settings";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recent" element={<Recent />} /> 
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>
        {/* this one is used if url doesn't exist */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
