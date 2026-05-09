import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LOGO_URL = "/logo.jpg";

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleReadyRef = useRef(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  const initGoogle = () => {
    if (googleReadyRef.current) {
      return true;
    }

    const google = (window as any).google;
    if (!google?.accounts?.id || !googleClientId) {
      return false;
    }

    google.accounts.id.initialize({
      client_id: googleClientId,
      ux_mode: 'popup',
      callback: async (response: { credential: string }) => {
        setIsGoogleLoading(true);
        const result = await loginWithGoogle(response.credential);
        setIsGoogleLoading(false);

        if (result.success) {
          navigate(from, { replace: true });
        } else {
          setError(result.message || 'Google login failed');
        }
      },
    });

    if (googleButtonRef.current) {
      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
      });
    }

    googleReadyRef.current = true;
    return true;
  };

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const timeout = window.setTimeout(() => {
      initGoogle();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [googleClientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('');

    if (!googleClientId) {
      setError('Google login is not configured');
      return;
    }

    const ready = initGoogle();
    if (!ready) {
      setError('Google login is not ready yet');
      return;
    }

    const button = googleButtonRef.current?.querySelector(
      'div[role="button"]'
    ) as HTMLDivElement | null;

    if (button) {
      button.click();
    } else {
      const google = (window as any).google;
      google?.accounts?.id?.prompt();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <img
              src={LOGO_URL}
              alt="ORIONX"
              className="w-40 h-auto object-contain mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome Back
            </h1>
            <p className="text-text-secondary">
              Sign in to your ORIONX account
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div
              ref={googleButtonRef}
              className="absolute -left-[9999px] -top-[9999px]"
            />
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3 rounded-xl border border-border bg-background text-text-primary font-medium hover:bg-surface-elevated transition-colors"
            >
              <img
                src="/google_icon.png"
                alt="Google"
                className="inline-block w-5 h-5 mr-3"
              />
              {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-muted">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-secondary">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}