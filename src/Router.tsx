import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/Login/sign_in';
import RegisterPage from './pages/Login/sign_up';
import PrivateRoute from './components/PrivateRoute';


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute />}>
        
        </Route>
        {/* this one is used if url doesn't exist */}
        <Route path="home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;