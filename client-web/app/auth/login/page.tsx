'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLogin } from './useLogin';

export default function LoginPage() {
  const { form, handleChange, handleSubmit, loading } = useLogin();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Login</h2>
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange('email')}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange('password')}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}