'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSignup = () => {

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('session') || 'null');
        const now = new Date().getTime();
        if (session && now - session.loginTime < 10 * 60 * 1000) {
            router.push('/dashboard');
        }
    }, []);


    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const isValid = form.name && form.email && form.password.length >= 6;

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return toast.error('Please fill all fields. Password must be at least 6 characters.');

        try {
            setLoading(true);
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = users.find((u: any) => u.email === form.email);

            if (userExists) {
                toast.error('User already exists!');
                return;
            }

            users.push(form);
            localStorage.setItem('users', JSON.stringify(users));
            toast.success('Signup successful! Redirecting...');
            router.push('/auth/login');
        } catch (err) {
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return { form, handleChange, handleSubmit, loading, isValid };
};