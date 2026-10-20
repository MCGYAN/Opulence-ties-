'use client';

import { SITE_NAME, SITE_TAGLINE, LOGO_PATH, CONTACT_EMAIL, CONTACT_PHONE, BUSINESS_ADDRESS, SOCIAL_INSTAGRAM, SOCIAL_TIKTOK, CATALOG_PDF_PREFIX, OG_IMAGE_PATH, HERO_IMAGE_PATH, DEFAULT_PRODUCT_BRAND } from '@/lib/site-brand';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { homePathFor, resolveAccess, writeOfficeSession } from '@/lib/admin-team';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { getToken, verifying } = useRecaptcha();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const person = resolveAccess(email);
    writeOfficeSession(person.email);
    router.push(homePathFor(person.access));
    router.refresh();
    return;

    // reCAPTCHA verification
    const isHuman = await getToken('admin_login');
    if (!isHuman) {
      setError('Security verification failed. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        const secureAttr = window.location.protocol === 'https:' ? '; Secure' : '';
        // Set auth cookie so middleware can verify the session server-side
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secureAttr}`;
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax${secureAttr}`;

        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-office flex min-h-screen items-center justify-center p-4 text-[#2a241e]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src={LOGO_PATH} alt={SITE_NAME} className="mx-auto h-20 w-auto object-contain" />
          </Link>
          <h1 className="mt-6 mb-2 text-3xl font-bold text-[#2a241e]">The office</h1>
          <p className="text-[#6b6156]">Sign in to the owner&apos;s desk</p>
        </div>

        <div className="admin-panel rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <i className="ri-error-warning-line text-red-600 text-xl mt-0.5"></i>
              <div>
                <p className="text-red-800 font-semibold">Login Failed</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a241e]/80">
                Email Address
              </label>
              <div className="relative">
                <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#e4d8c4] bg-white/80 py-3 pl-12 pr-4 text-[#2a241e] outline-none focus:border-[#c4a15a]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a241e]/80">
                Password
              </label>
              <div className="relative">
                <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#e4d8c4] bg-white/80 py-3 pl-12 pr-12 text-[#2a241e] outline-none focus:border-[#c4a15a]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || verifying}
              className="w-full rounded-xl bg-[#c4a15a] py-3 font-semibold text-[#2a241e] transition-colors hover:bg-[#a8873f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading || verifying ? (
                <span className="flex items-center justify-center space-x-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>{verifying ? 'Verifying...' : 'Signing in...'}</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
            <p className="text-center text-xs text-[#6b6156]">Leave the email blank for the owner. A team email opens only what you allowed.</p>
          </form>

          {/* Admin access is restricted to users with admin/staff role */}
        </div>

        <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#6b6156] hover:text-[#c4a15a]">
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
