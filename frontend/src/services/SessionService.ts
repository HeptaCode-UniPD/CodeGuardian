import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const saveUserID = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getUserID = (key: string) => {
  return localStorage.getItem(key);
};

export const logout = (key: string) => {
  localStorage.removeItem(key);
}

export function isLogged() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getUserID('userID');

  useEffect(() => {
    if (!userId && location.pathname !== '/login') {
      navigate('/login');
    }

    if (userId && location.pathname === '/login') {
      navigate('/repositories');
    }
  }, [userId, location.pathname, navigate]);
}