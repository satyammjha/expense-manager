'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/auth/authSlice';

export const useSessionTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0); 
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const session = JSON.parse(localStorage.getItem('session') || 'null');
      if (!session) {
        clearInterval(interval);
        return;
      }

      const now = new Date().getTime();
      const expiry = session.loginTime + 10 * 60 * 1000;
      const remaining = expiry - now;

      if (remaining <= 0) {
        localStorage.removeItem('session');
        dispatch(logout());
        clearInterval(interval);
        router.replace('/auth/login');
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, router]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return { minutes, seconds };
};