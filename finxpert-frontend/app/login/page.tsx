'use client';

import { useState } from 'react';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const resp = await login(form);

    // ✅ Store token
    localStorage.setItem('token', resp.accessToken);
    
    // ✅ Redirect after login
    window.location.href = '/dashboard';
    try {
      const resp = await login(form);
      console.log('Logged in:', resp);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
