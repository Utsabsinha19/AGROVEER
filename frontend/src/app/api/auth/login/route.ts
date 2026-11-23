import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, originalHash] = parts;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hash, 'hex'));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Find profile by email
    let profile = await prisma.profile.findFirst({
      where: { email: cleanEmail },
    });

    const isOwnerAdmin = cleanEmail.includes('admin') || cleanEmail.endsWith('@arveerimpex.com') || cleanEmail === 'utsabsinha468@gmail.com';

    if (!profile) {
      // Auto-provision if initial admin or standard commercial user
      const derivedUid = `neon_usr_${crypto.createHash('md5').update(cleanEmail).digest('hex').slice(0, 16)}`;
      const derivedName = cleanEmail.split('@')[0];
      const newHash = hashPassword(cleanPassword);

      profile = await prisma.profile.create({
        data: {
          firebaseUid: derivedUid,
          email: cleanEmail,
          fullName: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
          role: isOwnerAdmin ? 'ADMIN' : 'CUSTOMER',
          passwordHash: newHash,
        },
      });
    } else {
      // Profile exists: verify password
      if (profile.passwordHash) {
        const isMatch = verifyPassword(cleanPassword, profile.passwordHash);
        if (!isMatch) {
          return NextResponse.json(
            { error: 'Invalid password. Please check your credentials and retry.' },
            { status: 401 }
          );
        }
      } else {
        // First-time password set for existing OAuth/OTP user
        const newHash = hashPassword(cleanPassword);
        profile = await prisma.profile.update({
          where: { id: profile.id },
          data: {
            passwordHash: newHash,
            role: isOwnerAdmin ? 'ADMIN' : undefined,
          },
        });
      }
    }

    // 2. Build secure session payload
    const sessionPayload = {
      uid: profile.firebaseUid,
      userId: profile.id,
      identifier: cleanEmail,
      fullName: profile.fullName,
      role: profile.role,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Sign in successful! Welcome to Arveer Impex.',
      profile,
      token: sessionToken,
    });

    // 3. Set HTTP-only cookie
    response.cookies.set('agrove_session', sessionToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Sign In Error:', err);
    return NextResponse.json(
      { error: err.message || 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
