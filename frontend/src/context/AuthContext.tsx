'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from '@/lib/firebase';

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  role: 'CUSTOMER' | 'DEALER' | 'WAREHOUSE_STAFF' | 'ADMIN';
  companyName?: string | null;
  gstin?: string | null;
  shippingAddress?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  profileImageUrl?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'register';
  openAuthModal: (mode?: 'signin' | 'register' | unknown) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; profile?: UserProfile; error?: string }>;
  register: (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: 'CUSTOMER' | 'DEALER';
    companyName?: string;
    gstin?: string;
    city?: string;
    state?: string;
  }) => Promise<{ success: boolean; profile?: UserProfile; error?: string }>;
  sendOtp: (identifier: string, type?: 'phone' | 'email') => Promise<{ success: boolean; otpPreview?: string; error?: string }>;
  verifyOtp: (params: {
    identifier: string;
    otp: string;
    fullName?: string;
    role?: 'CUSTOMER' | 'DEALER';
    companyName?: string;
    gstin?: string;
    city?: string;
    state?: string;
  }) => Promise<{ success: boolean; profile?: UserProfile; error?: string }>;
  loginWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; profile?: UserProfile; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  token: null,
  loading: true,
  isAdmin: false,
  isAuthModalOpen: false,
  authModalMode: 'signin',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: async () => ({ success: false, error: 'Not initialized' }),
  register: async () => ({ success: false, error: 'Not initialized' }),
  sendOtp: async () => ({ success: false, error: 'Not initialized' }),
  verifyOtp: async () => ({ success: false, error: 'Not initialized' }),
  loginWithGoogle: async () => ({ user: null, error: 'Not initialized' }),
  updateProfile: async () => ({ success: false, error: 'Not initialized' }),
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');

  const openAuthModal = (mode?: 'signin' | 'register' | unknown) => {
    if (mode === 'signin' || mode === 'register') {
      setAuthModalMode(mode);
    } else {
      setAuthModalMode('signin');
    }
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Restore Neon session on load
  const restoreNeonSession = async () => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('agrove_auth_token') : null;
      if (storedToken) {
        setToken(storedToken);
      }

      const res = await fetch('/api/auth/session', {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (err) {
      console.warn('Neon session check error:', err);
    }
  };

  const fetchFirebaseProfile = async (firebaseUser: User) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to sync profile with Neon DB:', err);
    }
  };

  useEffect(() => {
    restoreNeonSession().finally(() => setLoading(false));

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchFirebaseProfile(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Sign in failed.' };
      }

      if (data.profile && data.token) {
        setProfile(data.profile);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('agrove_auth_token', data.token);
          localStorage.setItem('agrove_user_profile', JSON.stringify(data.profile));
        }
        setIsAuthModalOpen(false);
      }

      return { success: true, profile: data.profile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error signing in.' };
    }
  };

  const register = async (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: 'CUSTOMER' | 'DEALER';
    companyName?: string;
    gstin?: string;
    city?: string;
    state?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      if (data.profile && data.token) {
        setProfile(data.profile);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('agrove_auth_token', data.token);
          localStorage.setItem('agrove_user_profile', JSON.stringify(data.profile));
        }
        setIsAuthModalOpen(false);
      }

      return { success: true, profile: data.profile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error registering account.' };
    }
  };

  const sendOtp = async (identifier: string, type: 'phone' | 'email' = 'phone') => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP.' };
      }
      return { success: true, otpPreview: data.otpPreview };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while sending OTP.' };
    }
  };

  const verifyOtp = async (params: {
    identifier: string;
    otp: string;
    fullName?: string;
    role?: 'CUSTOMER' | 'DEALER';
    companyName?: string;
    gstin?: string;
    city?: string;
    state?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed.' };
      }

      if (data.profile && data.token) {
        setProfile(data.profile);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('agrove_auth_token', data.token);
          localStorage.setItem('agrove_user_profile', JSON.stringify(data.profile));
        }
        setIsAuthModalOpen(false);
      }

      return { success: true, profile: data.profile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error verifying code.' };
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.user) {
      await fetchFirebaseProfile(result.user);
      setIsAuthModalOpen(false);
    }
    setLoading(false);
    return result;
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('agrove_auth_token') : token;
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || 'Failed to update profile.' };
      }

      if (result.profile) {
        setProfile(result.profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('agrove_user_profile', JSON.stringify(result.profile));
        }
      }
      return { success: true, profile: result.profile };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error updating profile.' };
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch {}
    setUser(null);
    setProfile(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrove_auth_token');
      localStorage.removeItem('agrove_user_profile');
    }
    // Remove cookie
    document.cookie = 'agrove_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchFirebaseProfile(user);
    } else {
      await restoreNeonSession();
    }
  };

  const isAdmin = 
    profile?.role === 'ADMIN' || 
    user?.email?.endsWith('@arveerimpex.com') === true ||
    profile?.email?.endsWith('@arveerimpex.com') === true ||
    profile?.email === 'admin@agroveer.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAdmin,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        sendOtp,
        verifyOtp,
        loginWithGoogle,
        updateProfile,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

