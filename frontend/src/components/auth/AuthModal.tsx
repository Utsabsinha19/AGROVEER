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
      setSuccessMsg('Authentication successful! Welcome to Agroveer.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeAuthModal} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border border-[#E2E6DF] rounded-3xl shadow-2xl overflow-hidden z-10 text-[#252B27] flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#F5F7F1] border-b border-[#E2E6DF] relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E6DF] flex items-center justify-center p-1 shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Agroveer & Sawking Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#252B27]">
                  Agroveer™ Buyer & Dealer Portal
                </h3>
                <p className="text-[11px] text-[#245B37] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#245B37]" />
                  <span>Secure Neon Postgres Session</span>
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-xl bg-white hover:bg-[#EAEFE6] text-[#767E78] hover:text-[#252B27] border border-[#E2E6DF] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mt-4 p-1 rounded-xl bg-white border border-[#E2E6DF]">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); resetForm(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#245B37] text-white shadow-xs'
                  : 'text-[#4E5550] hover:text-[#252B27]'
              }`}
            >
              Sign In with Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); resetForm(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#245B37] text-white shadow-xs'
                  : 'text-[#4E5550] hover:text-[#252B27]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#245B37] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM (Email ID + Password) */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#767E78]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com or your-email@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs sm:text-sm text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#767E78]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs sm:text-sm text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#767E78] hover:text-[#252B27]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#245B37] hover:bg-[#1C472B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
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
                <p className="text-xs text-[#4E5550]">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); resetForm(); }}
                    className="text-[#245B37] font-bold hover:underline"
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
                <label className="block text-xs font-semibold text-[#252B27] mb-1">
                  Account Classification *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('CUSTOMER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'CUSTOMER'
                        ? 'bg-[#245B37] border-[#245B37] text-white shadow-xs'
                        : 'bg-[#F5F7F1] border-[#E2E6DF] text-[#4E5550] hover:text-[#252B27]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Farmer / Retail Buyer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('DEALER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'DEALER'
                        ? 'bg-[#245B37] border-[#245B37] text-white shadow-xs'
                        : 'bg-[#F5F7F1] border-[#E2E6DF] text-[#4E5550] hover:text-[#252B27]'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Machinery Dealer</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27] mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27] mb-1">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27] mb-1">
                  Create Password (min 6 chars) *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full px-3 pr-10 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#767E78] hover:text-[#252B27]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Dealer-Specific Fields */}
              {role === 'DEALER' && (
                <div className="p-3 rounded-xl bg-[#F5F7F1] border border-[#E2E6DF] space-y-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#252B27] mb-1">
                      Dealership / Firm Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Kisan Krishi Kendra"
                      className="w-full px-3 py-1.5 bg-white border border-[#E2E6DF] rounded-lg text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#252B27] mb-1">
                      GSTIN Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      className="w-full px-3 py-1.5 bg-white border border-[#E2E6DF] rounded-lg text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#245B37] hover:bg-[#1C472B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Toggle */}
              <div className="text-center pt-1">
                <p className="text-xs text-[#4E5550]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); resetForm(); }}
                    className="text-[#245B37] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
