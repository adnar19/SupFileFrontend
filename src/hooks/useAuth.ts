import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/config';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | undefined>(Cookies.get('token'));
  const isAuthorized = Cookies.get('isAuthorized');

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
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

  return { isAuthenticated, loading, isAuthorized };
};

export default useAuth;