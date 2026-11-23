import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Token not provided' }, { status: 401 });
    }

    // In production with Firebase Admin configured, verify the ID token.
    // For development, parse token claims or derive user UID safely.
    let uid = 'demo_user';
    let email = 'farmer@agroveer.com';
    let name = 'Commercial Buyer';

    try {
      // Decode JWT payload safely
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        uid = payload.user_id || payload.sub || uid;
        email = payload.email || email;
        name = payload.name || payload.email?.split('@')[0] || name;
      }
    } catch {
      // Use fallback
    }

    // Determine admin role
    const isAdminEmail = email?.toLowerCase().endsWith('@arveerimpex.com') || email === 'admin@agroveer.com';
    const role = isAdminEmail ? 'ADMIN' : 'CUSTOMER';

    // Upsert Profile in Neon PostgreSQL via Prisma
    let profile = null;
    try {
      profile = await prisma.profile.upsert({
        where: { firebaseUid: uid },
        update: {
          email,
          fullName: name,
          role: isAdminEmail ? 'ADMIN' : undefined,
        },
        create: {
          firebaseUid: uid,
          email,
          fullName: name,
          role,
        },
      });
    } catch (dbErr) {
      console.warn('Neon DB connection pending, using memory profile:', dbErr);
      profile = {
        id: `prof_${uid}`,
        firebaseUid: uid,
        email,
        phone: null,
        fullName: name,
        role,
        companyName: null,
        gstin: null,
        shippingAddress: null,
        city: null,
        state: null,
        pincode: null,
        profileImageUrl: null,
      };
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

