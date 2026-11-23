import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderKey',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'agrove-ecommerce.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agrove-ecommerce',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'agrove-ecommerce.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || 'Google sign-in failed' };
  }
}

// Phone OTP Recaptcha Setup
export function setupPhoneRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - allow signInWithPhoneNumber
    },
  });
}

// Send Phone OTP
export async function sendPhoneOtp(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<{ confirmationResult: ConfirmationResult | null; error: string | null }> {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, error: null };
  } catch (error: any) {
    return { confirmationResult: null, error: error.message || 'Failed to send OTP' };
  }
}

// Firebase Storage Upload Helper for Products and Profile Images
export async function uploadToFirebaseStorage(
  file: File | Blob, 
  folder: 'products' | 'profiles' | 'documents' = 'products',
  customFileName?: string
): Promise<string> {
  const fileName = customFileName || `${Date.now()}_${(file as File).name || 'upload.jpg'}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

// Sign Out
export async function signOutUser() {
  await firebaseSignOut(auth);
}
