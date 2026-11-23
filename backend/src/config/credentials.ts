import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { Resend } from 'resend';
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

// ==============================================================================
// 1. Unified Environment Credentials Registry
// ==============================================================================
export const credentials = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000',

  // Database / Prisma
  database: {
    url: process.env.DATABASE_URL || '',
    directUrl: process.env.DIRECT_URL || '',
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },

  // Resend Email
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'orders@arveerimpex.com',
    notificationEmail: process.env.RESEND_NOTIFICATION_EMAIL || 'sales@arveerimpex.com',
  },

  // Firebase Admin
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },

  // Meta WhatsApp Business Cloud API
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    wabaId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    apiToken: process.env.WHATSAPP_API_TOKEN || '',
    commercialDeskPhone: process.env.WHATSAPP_COMMERCIAL_DESK_PHONE || '917352210000',
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'ct7edeoo',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    url: process.env.CLOUDINARY_URL || '',
  },
};

// ==============================================================================
// 2. Client Initializers (Safe Singletons)
// ==============================================================================

// Razorpay Client Instance
export const razorpayClient: Razorpay | null = (() => {
  if (
    credentials.razorpay.keyId &&
    credentials.razorpay.keySecret &&
    !credentials.razorpay.keyId.includes('YourTestKeyId')
  ) {
    try {
      return new Razorpay({
        key_id: credentials.razorpay.keyId,
        key_secret: credentials.razorpay.keySecret,
      });
    } catch (err) {
      console.warn('⚠️ Razorpay failed to initialize with provided keys:', err);
      return null;
    }
  }
  return null;
})();

// Resend Email Client Instance
export const resendClient: Resend | null = (() => {
  if (credentials.resend.apiKey && !credentials.resend.apiKey.includes('YourResendApiKey')) {
    try {
      return new Resend(credentials.resend.apiKey);
    } catch (err) {
      console.warn('⚠️ Resend failed to initialize with provided API key:', err);
      return null;
    }
  }
  return null;
})();

// Firebase Admin App Instance
export const firebaseAdminApp: App | null = (() => {
  if (
    credentials.firebase.projectId &&
    credentials.firebase.clientEmail &&
    credentials.firebase.privateKey &&
    !credentials.firebase.privateKey.includes('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3')
  ) {
    try {
      if (!getApps().length) {
        return initializeApp({
          credential: cert({
            projectId: credentials.firebase.projectId,
            clientEmail: credentials.firebase.clientEmail,
            privateKey: credentials.firebase.privateKey,
          }),
        });
      }
      return getApp();
    } catch (err) {
      console.warn('⚠️ Firebase Admin failed to initialize:', err);
      return null;
    }
  }
  return null;
})();

// Prisma Client Instance (Lazy-loaded with Prisma 7 pg adapter)
let prismaInstance: PrismaClient | null = null;
export const getPrismaClient = (): PrismaClient => {
  if (!prismaInstance) {
    const connectionString = credentials.database.url || 'postgresql://postgres:postgres@localhost:5432/agrove_db?schema=public';
    try {
      const adapter = new PrismaPg({ connectionString });
      prismaInstance = new PrismaClient({ adapter });
    } catch {
      prismaInstance = new PrismaClient();
    }
  }
  return prismaInstance;
};
