// src/utils/auth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    }
  }, [navigate]);
};
