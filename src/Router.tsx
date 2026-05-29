import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/not-found";
import LoginPage from "./pages/Auth/login";
import RegisterPage from "./pages/Auth/sign_up";
import MyDrive from "./pages/Dashboard/MyDrive";
import Dashboard from "./pages/Dashboard/stats";
import AllFiles from "./pages/Dashboard/allFiles";
import PrivateRoute from "./components/PrivateRoute";
import Favorites from "./pages/Dashboard/favorites";
import Trash from "./pages/Dashboard/trash";
import AccountSettings from "./pages/Auth/account_settings";
import VerifyEmail from "./pages/Auth/verify-email";
import ForgotPasswordPage from "./pages/Auth/forgot-password";
import ResetPasswordPage from "./pages/Auth/reset-password";
import PublicShare from "./pages/PublicShare";
import SharedWithMe from "./pages/Dashboard/SharedWithMe";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-drive" element={<MyDrive />} />
          <Route path="/folder/:folderId" element={<MyDrive />} />
          <Route path="/all-files" element={<AllFiles />} />
          <Route path="/shared-with-me" element={<SharedWithMe />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>
        <Route path="/share/:token" element={<PublicShare />} />
        {/* this one is used if url doesn't exist */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
