'use client';

import { useState } from 'react';
import Image from 'next/image';

import HealthyFood from './public/HealthyFood.png';
import Logo from './public/Logo.png';

type FormState = { name: string; email: string; password: string; confirm: string };

export default function SignUpSheet() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onChange =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const e: string[] = [];
    if (!form.name.trim()) e.push('Name is required.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.push('Enter a valid email.');
    if (form.password.length < 8) e.push('Password must be at least 8 characters.');
    if (form.password !== form.confirm) e.push('Passwords do not match.');
    setErrors(e);
    return e.length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      // Redirect to Auth0 sign-up/login
      // Auth0 will handle the registration flow
      window.location.href="/api/auth/login";
    } finally {
      setLoading(false);
    }
  };

  // Auth0 login handler
  const handleAuth0Login = () => {
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="relative min-h-screen">
      {/* Full background image with proper scaling */}
      <Image
        src={HealthyFood}
        alt="Healthy food background"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-emerald-700/40" />

      {/* Centered sheet */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-[580px] rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/60">
          <div className="px-10 pt-10 pb-3 text-center">
            <div className="mx-auto relative h-16 w-16">
              <Image src={Logo} alt="SafeBites logo" fill className="object-contain drop-shadow" />
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">SafeBites</h1>
            <p className="mt-2 text-gray-600">Sign up to get started!</p>
          </div>

          <div className="px-10 pb-12">
            {/* Auth0 login button */}
            <button
              onClick={handleAuth0Login}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium shadow-sm hover:bg-gray-50 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#10B981"/>
              </svg>
              Continue with Auth0
            </button>

            <div className="relative my-8">
              <div className="h-px bg-gray-200" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white/90 px-3 text-xs text-gray-500">
                or
              </span>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {errors.length > 0 && (
                <ul className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3 space-y-1">
                  {errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              )}

              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={onChange('name')}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={onChange('email')}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange('password')}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={onChange('confirm')}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {loading ? 'Signing Up…' : 'Sign Up'}
              </button>

              {/* More spacing before log-in text */}
              <p className="text-center text-sm text-gray-700 mt-6">
                Already have an account?{' '}
                <button
                  onClick={handleAuth0Login}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Log In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
