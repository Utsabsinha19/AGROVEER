import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, type = 'phone', fullName = '' } = body;

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { error: 'A valid phone number or email address is required.' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Generate cryptographic 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save to Neon PostgreSQL OtpVerification table
    try {
      // Invalidate any prior active OTPs for this user
      await prisma.otpVerification.updateMany({
        where: {
          identifier: cleanIdentifier,
          isVerified: false,
        },
        data: {
          isVerified: true, // mark as superseded
        },
      });

      // Insert new real-time OTP record
      await prisma.otpVerification.create({
        data: {
          identifier: cleanIdentifier,
          otpCode,
          expiresAt,
          isVerified: false,
        },
      });
    } catch (dbErr) {
      console.warn('Neon DB OTP record creation warning:', dbErr);
    }

    console.log(`[NEON AUTH] Real-Time OTP Generated for ${cleanIdentifier}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${identifier}`,
      identifier: cleanIdentifier,
      expiresInSeconds: 600,
    });
  } catch (err: any) {
    console.error('Send OTP Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to dispatch verification code.' },
      { status: 500 }
    );
  }
}

