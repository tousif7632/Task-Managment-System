'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '@/redux/slices/userSlice';

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on client side
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch(initializeAuth({ user, token: savedToken }));
      } catch (error) {
        // If parsing fails, clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
} 