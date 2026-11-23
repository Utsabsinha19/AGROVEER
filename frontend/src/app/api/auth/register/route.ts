import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      fullName = '', 
      phone = '', 
      role = 'CUSTOMER', 
      companyName = '', 
      gstin = '',
      city = '',
      state = '' 
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanPhone = phone.trim() || null;
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    // Check if account already exists with password
    const existing = await prisma.profile.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      },
    });

    if (existing && existing.passwordHash) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const isOwnerAdmin = cleanEmail.includes('admin') || cleanEmail.endsWith('@arveerimpex.com') || cleanEmail === 'utsabsinha468@gmail.com';
    const resolvedRole = isOwnerAdmin ? 'ADMIN' : (role === 'DEALER' ? 'DEALER' : 'CUSTOMER');
    const passwordHash = hashPassword(cleanPassword);
    const derivedUid = `neon_usr_${crypto.createHash('md5').update(cleanEmail).digest('hex').slice(0, 16)}`;

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { email: cleanEmail },
      update: {
        fullName: cleanName,
        phone: cleanPhone,
        role: resolvedRole,
        companyName: companyName.trim() || null,
        gstin: gstin.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        passwordHash,
      },
      create: {
        firebaseUid: derivedUid,
        email: cleanEmail,
        phone: cleanPhone,
        fullName: cleanName,
        role: resolvedRole,
        companyName: companyName.trim() || null,
        gstin: gstin.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        passwordHash,
      },
    });

    const sessionPayload = {
      uid: profile.firebaseUid,
      userId: profile.id,
      identifier: cleanEmail,
      fullName: profile.fullName,
      role: profile.role,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Account registered successfully! Welcome to Arveer Impex.',
      profile,
      token: sessionToken,
    });

    response.cookies.set('agrove_session', sessionToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Registration Error:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
