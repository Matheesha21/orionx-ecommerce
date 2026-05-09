import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon } from
'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
const LOGO_URL = "/WhatsApp_Image_2025-08-21_at_12.50.56_(1).jpg";
const API_BASE_URL = "http://127.0.0.1:5050/api";

export function RegisterPage() {
  const [step, setStep] = useState<'details' | 'otp' | 'password'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setError('');
    setOtpStatus('');
    setOtpLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/users/request-otp`, { email });
      setOtpSent(true);
      setOtpVerified(false);
      setOtpStatus('OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setError('');
    setOtpStatus('');
    setOtpLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/users/verify-otp`, { email, otp });
      setOtpVerified(true);
      setOtpStatus('Email verified');
      setStep('password');
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otpVerified) {
      setError('Please verify your email before creating an account');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="relative w-full max-w-md">

        <div className="bg-surface/80 backdrop-blur border border-border rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src={LOGO_URL}
                alt="ORIONX"
                className="h-12 w-auto mx-auto mb-4" />

            </Link>
            <h1 className="text-2xl font-bold text-text-primary">
              Create Account
            </h1>
            <p className="text-text-secondary mt-2">
              Join the ORIONX community
            </p>
          </div>

          {/* Error Message */}
          {error &&
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          }

          {/* Form */}
          {step === 'details' &&
          <form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-secondary mb-2">

                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="John Doe" />

                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-secondary mb-2">

                  Email Address
                </label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setOtp('');
                      setOtpSent(false);
                      setOtpVerified(false);
                      setOtpStatus('');
                      setStep('details');
                    }}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="you@example.com" />

                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !email || !name}
                className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">

                {otpLoading ? 'Sending OTP...' : 'Verify Email'}
              </button>
            </form>
          }

          {step === 'otp' &&
          <form className="space-y-5">
              <div className="rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-text-secondary">
                We sent a verification code to {email}
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-text-secondary mb-2">

                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Enter OTP" />
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading || !otp}
                className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">

                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full py-2 border border-border text-text-secondary rounded-lg text-sm font-semibold transition-colors">

                Back
              </button>
            </form>
          }

          {step === 'password' &&
          <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-green-400">
                Email verified
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-secondary mb-2">

                  Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="••••••••" />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">

                    {showPassword ?
                    <EyeOffIcon className="w-5 h-5" /> :

                    <EyeIcon className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-text-secondary mb-2">

                  Confirm Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="••••••••" />

                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">

                {isLoading ?
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

                'Create Account'
                }
              </button>
            </form>
          }

          {/* Login Link */}
          <p className="text-center text-text-secondary mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-light font-medium transition-colors">

              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>);

}