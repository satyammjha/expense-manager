'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSignup } from './useSignup';

export default function SignupPage() {
  const router = useRouter();
  const { form, handleChange, handleSubmit, loading, isValid } = useSignup();
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    const now = new Date().getTime();
    if (session && now - session.loginTime < 10 * 60 * 1000) {
      router.push('/dashboard');
    }
  }, [router]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Signup</h2>
      <Input placeholder="Name" value={form.name} onChange={handleChange('name')} required />
      <Input type="email" placeholder="Email" value={form.email} onChange={handleChange('email')} required />
      <Input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange('password')} required />
      <Button type="submit" className="w-full" disabled={!isValid || loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
}