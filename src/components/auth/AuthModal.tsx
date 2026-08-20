'use client';

import React, { useState } from 'react';
import BucolishLogo from '../brand/BucolishLogo';
import { X, Mail, Phone, KeyRound, ArrowRight, Sparkles, CheckCircle2, User, Lock, Inbox, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'LOGIN' | 'SIGNUP';
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({
  isOpen,
  initialMode = 'SIGNUP',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [step, setStep] = useState<'FORM' | 'OTP_VERIFY'>('FORM');

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [previewCode, setPreviewCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // 1. Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('Please enter your Email or Phone number');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your account password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/password-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanEmail, password: cleanPassword }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Request OTP Code Handler
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (mode === 'SIGNUP' && (!cleanPhone || cleanPhone.length < 10)) {
      setError('Mobile number is mandatory for resident safety records');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, phone: cleanPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('OTP_VERIFY');
        if (data.previewCode) {
          setPreviewCode(data.previewCode);
          setOtp(data.previewCode);
        }
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch {
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP Code Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          otp: otp.trim(),
          name: mode === 'SIGNUP' ? name.trim() : undefined,
          password: password.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch {
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-gray-100 overflow-hidden text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <BucolishLogo size="md" showTagline={false} />
          <h2 className="text-xl font-black text-slate-950 mt-2">
            {step === 'FORM'
              ? mode === 'LOGIN'
                ? 'Sign In to Bucolish'
                : 'Create Resident Account'
              : 'Verify Email Code'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xs font-medium">
            {step === 'FORM'
              ? 'Gurugram’s verified co-living and flatmate matching network.'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {step === 'FORM' && (
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('SIGNUP');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                mode === 'SIGNUP'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                mode === 'LOGIN'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Preview Code Alert Banner */}
        {previewCode && step === 'OTP_VERIFY' && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs font-bold text-purple-900 flex items-center gap-2 animate-in fade-in">
            <Inbox size={16} className="text-purple-600 shrink-0" />
            <span>
              Security Code for <span className="underline">{email}</span>: <span className="font-black text-sm text-purple-700">{previewCode}</span>
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {/* FORM STEP */}
        {step === 'FORM' && (
          <div>
            {mode === 'SIGNUP' ? (
              /* SIGN UP FORM (Name + Email + Mandatory Phone + Password -> Email Code) */
              <form onSubmit={handleRequestOtp} className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 text-xs font-bold shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com or name@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 text-xs font-bold shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Mobile Number <span className="text-red-500">* (Mandatory for verified records)</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 text-xs font-bold shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Create Account Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a secure password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 text-xs font-bold shadow-inner"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary !py-3 !rounded-xl text-xs font-black justify-center shadow-md mt-2"
                >
                  {loading ? 'Sending Code to Email...' : 'Send Verification Code to Email'}
                  <ArrowRight size={15} />
                </button>
              </form>
            ) : (
              /* SIGN IN FORM (Password vs OTP Code) */
              <div>
                {/* Sign in method switch */}
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod(loginMethod === 'PASSWORD' ? 'OTP' : 'PASSWORD');
                      setError('');
                    }}
                    className="text-[11px] font-bold text-purple-700 hover:underline"
                  >
                    {loginMethod === 'PASSWORD' ? 'Sign in with Email Code (OTP) instead' : 'Sign in with Password instead'}
                  </button>
                </div>

                {loginMethod === 'PASSWORD' ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-3.5 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Email Address or Username
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 text-xs font-bold shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Account Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 text-xs font-bold shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary !py-3.5 !rounded-xl text-xs font-black justify-center shadow-lg"
                    >
                      {loading ? 'Signing in...' : 'Sign In with Password'}
                      <ArrowRight size={15} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRequestOtp} className="space-y-3.5 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your registered email"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 text-xs font-bold shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary !py-3.5 !rounded-xl text-xs font-black justify-center shadow-lg"
                    >
                      {loading ? 'Sending Code...' : 'Send Verification Code to Email'}
                      <ArrowRight size={15} />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* OTP VERIFICATION STEP */}
        {step === 'OTP_VERIFY' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Enter 6-Digit Email Code
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-full pl-10 pr-4 py-3 text-center tracking-[0.25em] font-black text-xl rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-300 focus:ring-2 focus:ring-purple-600 shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="text-purple-700 font-bold hover:underline"
              >
                Change Details
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3.5 !rounded-xl text-xs font-black justify-center shadow-lg"
            >
              {loading ? 'Verifying...' : 'Verify Code & Enter Bucolish'}
              <CheckCircle2 size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
