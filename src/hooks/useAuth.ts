import { useEffect, useState } from 'react';
import { GetUser } from '../services/auth';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '../services/config';

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  theme?: 'light' | 'dark';
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | undefined>(Cookies.get('token'));

  const verifyUser = async () => {
    setLoading(true);
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Decode token locally to get userId
      const decoded: any = jwtDecode(token);
      const userId = decoded.id || decoded.sub;

      // Verify token with backend
      const response = await axios.get(`${API_URL}/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Token is valid, now get user info
        if (userId) {
          const res = await GetUser(userId);
          if (res && res.success) {
            setUser(res.data);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(true);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth verification error", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cookieToken = Cookies.get('token');
      if (cookieToken !== token) {
        setToken(cookieToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  return { isAuthenticated, loading, user, refreshUser: verifyUser, setToken };
};

export default useAuth;