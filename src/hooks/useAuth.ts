import { useEffect, useState } from 'react';
import { GetUser } from '../services/auth';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

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
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.id || decoded.sub;

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

  return { isAuthenticated, loading, user, refreshUser: verifyUser };
};

export default useAuth;