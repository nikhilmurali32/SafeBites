'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      await new Promise((r) => setTimeout(r, 600));
      alert('Signed up! (stub)');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    alert('Google sign-in (stub)');
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
            {/* Google button */}
            <button
              onClick={signInWithGoogle}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium shadow-sm hover:bg-gray-50 transition"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 31.9 29.3 35 24 35 16.8 35 11 29.2 11 22s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 3.4 29.6 1.5 24 1.5 11.7 1.5 1.5 11.7 1.5 24S11.7 46.5 24 46.5 46.5 36.3 46.5 24c0-1.1-.1-2.2-.3-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.9 16.1 19 13 24 13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 6.4 29.6 4.5 24 4.5 15.3 4.5 7.8 9.6 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 43.5c5.2 0 10-2 13.5-5.2l-6.2-5.1C29.2 34.8 26.8 36 24 36c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C8.7 39.2 15.8 43.5 24 43.5z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3C34.9 31.1 30 35 24 35c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C8.7 39.2 15.8 43.5 24 43.5 34.5 43.5 43.6 35 43.6 24c0-1.1-.1-2.2-.3-3.5z"/>
              </svg>
              Continue with Google
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
                <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
