'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { login } from '@/store/auth/authSlice';

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === form.email && u.password === form.password);

    if (!user) {
      setLoading(false);
      return toast.error('Invalid credentials');
    }

    const session = {
      email: user.email,
      loginTime: new Date().getTime(),
    };

    localStorage.setItem('session', JSON.stringify(session));
    dispatch(login());
    toast.success('Login successful!');
    router.push('/dashboard');
  };

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (session) {
      const now = new Date().getTime();
      const diff = now - session.loginTime;
      if (diff < 10 * 60 * 1000) {
        router.push('/dashboard');
      } else {
        localStorage.removeItem('session');
      }
    }
  }, []);

  return { form, handleChange, handleSubmit, loading };
};