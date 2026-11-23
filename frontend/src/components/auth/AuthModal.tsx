'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Building2, 
  User, 
  Lock,
  Loader2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode,
    closeAuthModal, 
    sendOtp, 
    verifyOtp, 
    loginWithGoogle 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  React.useEffect(() => {
    if (authModalMode) {
      setAuthMode(authModalMode);
    }
  }, [authModalMode, isAuthModalOpen]);
  const [identifierType, setIdentifierType] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'DEALER'>('CUSTOMER');

  // Step state: 1 = enter identifier, 2 = enter OTP
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!identifier.trim()) {
      setError(identifierType === 'phone' ? 'Please enter your mobile number.' : 'Please enter your email address.');
      return;
    }

    setLoading(true);
    const res = await sendOtp(identifier.trim(), identifierType);
    setLoading(false);

    if (res.success) {
      setStep(2);
      setSuccessMsg(`Verification code dispatched to ${identifier}`);
    } else {
      setError(res.error || 'Failed to dispatch code. Please check details and retry.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyOtp({
      identifier: identifier.trim(),
      otp: otp.trim(),
      fullName: fullName.trim() || undefined,
      role: role,
      companyName: companyName.trim() || undefined,
      gstin: gstin.trim() || undefined,
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Authentication verified via Neon Cloud! Welcome.');
      setTimeout(() => {
        closeAuthModal();
        resetForm();
      }, 1200);
    } else {
      setError(res.error || 'Invalid code. Please retry.');
    }
  };

  const resetForm = () => {
    setStep(1);
    setOtp('');
    setError(null);
    setSuccessMsg(null);
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
                <p className="text-[11px] text-[#A6C96A] font-mono">
                  Real-Time Neon Cloud Verification
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
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'register'
                  ? 'bg-[#24583D] text-[#F7F5F0] shadow-sm'
                  : 'text-[#E9E1CC]/70 hover:text-white'
              }`}
            >
              Register Account
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

          {/* STEP 1: Enter Phone / Email */}
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-[#E9E1CC]/80 font-medium">Verify using:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setIdentifierType('phone'); setIdentifier(''); }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      identifierType === 'phone'
                        ? 'bg-[#A6C96A] text-[#102C22] font-bold'
                        : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Mobile SMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIdentifierType('email'); setIdentifier(''); }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      identifierType === 'email'
                        ? 'bg-[#A6C96A] text-[#102C22] font-bold'
                        : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email OTP</span>
                  </button>
                </div>
              </div>

              {/* Identifier Input */}
              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                  {identifierType === 'phone' ? 'Mobile / WhatsApp Number *' : 'Email Address *'}
                </label>
                <div className="relative">
                  {identifierType === 'phone' ? (
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[rgba(166,201,106,0.3)] bg-[#14261F] text-[#A6C96A] text-xs font-mono font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98220 12345"
                        className="w-full bg-[#14261F] border border-[rgba(166,201,106,0.3)] rounded-r-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#A6C96A]"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="dealer@agroveer.com"
                        className="w-full bg-[#14261F] border border-[rgba(166,201,106,0.3)] rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#A6C96A]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Fields for Registration */}
              {authMode === 'register' && (
                <div className="space-y-3 pt-2 border-t border-white/10 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-[#14261F] border border-[rgba(166,201,106,0.3)] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#A6C96A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#E9E1CC] mb-1">Firm / Shop Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Kisan Agro Works"
                        className="w-full bg-[#14261F] border border-[rgba(166,201,106,0.3)] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#A6C96A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#E9E1CC] mb-1">Account Type</label>
                      <select
                        value={role}
                        onChange={(e: any) => setRole(e.target.value)}
                        className="w-full bg-[#14261F] border border-[rgba(166,201,106,0.3)] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#A6C96A]"
                      >
                        <option value="CUSTOMER">Retail Buyer</option>
                        <option value="DEALER">Authorized Dealer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#E9E1CC] mb-1">GSTIN Number (Optional)</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="27AABCS1429B1Z8"
                      className="w-full bg-[#14261F] border border-[rgba(166,201,106,0.3)] rounded-xl px-3.5 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#A6C96A]"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border border-[#A6C96A]/40 shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#A6C96A]" />
                    <span>Dispatching Neon OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Get Real-Time OTP</span>
                    <ArrowRight className="w-4 h-4 text-[#A6C96A]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Enter OTP Code */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#14261F] border border-[rgba(166,201,106,0.2)] text-xs">
                <span className="text-white/60 block text-[11px]">Verification code dispatched to:</span>
                <span className="font-mono font-bold text-white text-sm mt-0.5 block">{identifier}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#A6C96A] text-[11px] underline mt-1 cursor-pointer block"
                >
                  Change number or email
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9E1CC] mb-1">
                  Enter 6-Digit Verification Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full bg-[#14261F] border border-[rgba(166,201,106,0.4)] rounded-xl pl-9 pr-3.5 py-3 text-center tracking-[0.3em] font-mono text-base font-bold text-white focus:outline-none focus:border-[#A6C96A]"
                  />
                </div>
              </div>

              {/* Verify CTA */}
              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-3 px-4 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border border-[#A6C96A]/40 shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#A6C96A]" />
                    <span>Verifying with Neon DB...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#A6C96A]" />
                    <span>Verify & Continue Shopping</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full text-center text-xs text-[#E9E1CC]/70 hover:text-white underline py-1"
              >
                Didn't receive code? Resend OTP
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-mono tracking-widest text-white/40">Or</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Google Sign In Option */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Value note */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/50 pt-2 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A6C96A]" />
            <span>Authorized by Arveer Impex • Protected by Neon Cloud Auth</span>
          </div>

        </div>
      </div>
    </div>
  );
};
