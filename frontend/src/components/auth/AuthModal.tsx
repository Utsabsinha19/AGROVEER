'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  User, 
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode,
    closeAuthModal, 
    login,
    register,
    loginWithGoogle 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  React.useEffect(() => {
    if (authModalMode) {
      setAuthMode(authModalMode);
    }
  }, [authModalMode, isAuthModalOpen]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'DEALER'>('CUSTOMER');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setFullName('');
    setPhone('');
    setCompanyName('');
    setGstin('');
    setError(null);
    setSuccessMsg(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password.trim());
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Authentication successful! Welcome to Arveer Impex.');
      setTimeout(() => {
        closeAuthModal();
        resetForm();
      }, 1000);
    } else {
      setError(res.error || 'Invalid email or password. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (role === 'DEALER' && !companyName.trim()) {
      setError('Please provide your Dealership / Firm name.');
      return;
    }

    setLoading(true);
    const res = await register({
      email: email.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
      role: role,
      companyName: companyName.trim() || undefined,
      gstin: gstin.trim() || undefined,
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account created successfully! Welcome to the portal.');
      setTimeout(() => {
        closeAuthModal();
        resetForm();
      }, 1000);
    } else {
      setError(res.error || 'Failed to create account. Please check details.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.user && res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-forest-950/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeAuthModal} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#102C22] border border-[rgba(166,201,106,0.35)] rounded-3xl shadow-2xl overflow-hidden z-10 text-[#F7F5F0] flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#0E221B] border-b border-[rgba(166,201,106,0.18)] relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14261F] border border-[#A6C96A]/40 flex items-center justify-center p-1 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Agroveer & Sawking"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#F7F5F0]">
                  Buyer & Dealer Portal
                </h3>
                <p className="text-[11px] text-[#A6C96A] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#A6C96A]" />
                  <span>Neon Lakebase Postgres Protected</span>
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mt-4 p-1 rounded-xl bg-[#14261F] border border-[rgba(166,201,106,0.2)]">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); resetForm(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'signin'
                  ? 'bg-[#24583D] text-[#F7F5F0] shadow-sm'
                  : 'text-[#E9E1CC]/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); resetForm(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'register'
                  ? 'bg-[#24583D] text-[#F7F5F0] shadow-sm'
                  : 'text-[#E9E1CC]/70 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-green-900/40 border border-[#A6C96A]/50 text-green-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A6C96A] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM (Email ID + Password) */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A6C96A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com or your-email@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-sm text-[#F7F5F0] placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A6C96A]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-sm text-[#F7F5F0] placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#A6C96A] hover:bg-[#b8da7b] text-[#102C22] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Toggle */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#E9E1CC]/70">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); resetForm(); }}
                    className="text-[#A6C96A] font-bold hover:underline"
                  >
                    Register Account
                  </button>
                </p>
              </div>

            </form>
          ) : (
            /* REGISTER FORM (Email ID + Password + Details) */
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              {/* Account Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                  Account Classification *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('CUSTOMER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'CUSTOMER'
                        ? 'bg-[#24583D] border-[#A6C96A] text-[#F7F5F0]'
                        : 'bg-[#0E221B] border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Farmer / Retail Buyer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('DEALER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'DEALER'
                        ? 'bg-[#24583D] border-[#A6C96A] text-[#F7F5F0]'
                        : 'bg-[#0E221B] border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>B2B Dealer / Wholesale</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A6C96A]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Patil or Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-xs sm:text-sm text-[#F7F5F0] placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A6C96A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com or email@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-xs sm:text-sm text-[#F7F5F0] placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                  Create Password * (min. 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A6C96A]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-10 py-2 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-xs sm:text-sm text-[#F7F5F0] placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                  Mobile / WhatsApp Number <span className="text-white/40 font-normal">(Optional, for logistics updates)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A6C96A]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-xs sm:text-sm text-[#F7F5F0] placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                  />
                </div>
              </div>

              {/* B2B Dealer Fields */}
              {role === 'DEALER' && (
                <div className="space-y-2.5 pt-1 border-t border-[rgba(166,201,106,0.2)]">
                  <div>
                    <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                      Agro Dealership / Firm Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Kisan Agri Machineries & Tools"
                      className="w-full px-3 py-2 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-xs sm:text-sm text-[#F7F5F0] placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                      GSTIN (Optional, for 18% Input Tax Credit)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      className="w-full px-3 py-2 bg-[#0E221B] border border-[rgba(166,201,106,0.3)] rounded-xl text-xs sm:text-sm text-[#F7F5F0] uppercase font-mono placeholder-[#E9E1CC]/40 focus:outline-none focus:border-[#A6C96A] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#A6C96A] hover:bg-[#b8da7b] text-[#102C22] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Toggle */}
              <div className="text-center pt-1">
                <p className="text-xs text-[#E9E1CC]/70">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); resetForm(); }}
                    className="text-[#A6C96A] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* Social Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="bg-[#102C22] px-2 text-[#E9E1CC]/60">
                OR
              </span>
            </div>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-semibold text-[#F7F5F0] transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.3-1.5-.3-2.4z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Privacy Note */}
          <p className="text-[10px] text-center text-[#E9E1CC]/50 leading-relaxed pt-1">
            By signing in, you agree to Arveer Impex Commercial Dealer Terms & Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );
};
