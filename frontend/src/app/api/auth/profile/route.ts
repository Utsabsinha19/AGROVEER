import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('agrove_session')?.value;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : cookieToken;

    if (!token) {
      return NextResponse.json({ authenticated: false, profile: null });
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const profile = await prisma.profile.findFirst({
      where: {
        OR: [
          { id: decoded.userId },
          { firebaseUid: decoded.uid },
          { email: decoded.identifier },
          { phone: decoded.identifier },
        ]
      }
    });

    return NextResponse.json({ authenticated: !!profile, profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return handleProfileUpdate(request);
}

export async function PUT(request: NextRequest) {
  return handleProfileUpdate(request);
}

async function handleProfileUpdate(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('agrove_session')?.value;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : cookieToken;

    const body = await request.json();
    const { 
      email, 
      phone, 
      fullName, 
      companyName, 
      gstin, 
      shippingAddress, 
      city, 
      state, 
      pincode 
    } = body;

    let targetIdentifier = '';
    let targetUid = '';

    if (token) {
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
        targetIdentifier = decoded.identifier || '';
        targetUid = decoded.uid || decoded.userId || '';
      } catch {}
    }

    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanPhone = phone ? phone.trim() : null;

    if (!cleanEmail && !cleanPhone && !targetIdentifier) {
      return NextResponse.json(
        { error: 'Email address or phone number is required to save buyer profile.' },
        { status: 400 }
      );
    }

    // Try finding existing profile by token identifier, email, or phone
    const existing = await prisma.profile.findFirst({
      where: {
        OR: [
          ...(targetUid ? [{ firebaseUid: targetUid }] : []),
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          ...(targetIdentifier ? [
            { email: targetIdentifier },
            { phone: targetIdentifier },
            { firebaseUid: targetIdentifier }
          ] : [])
        ]
      }
    });

    let updatedProfile;

    if (existing) {
      updatedProfile = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          email: cleanEmail !== undefined ? cleanEmail : existing.email,
          phone: cleanPhone !== undefined ? cleanPhone : existing.phone,
          fullName: fullName?.trim() || existing.fullName,
          companyName: companyName !== undefined ? companyName.trim() : existing.companyName,
          gstin: gstin !== undefined ? gstin.trim().toUpperCase() : existing.gstin,
          shippingAddress: shippingAddress !== undefined ? shippingAddress.trim() : existing.shippingAddress,
          city: city !== undefined ? city.trim() : existing.city,
          state: state !== undefined ? state.trim() : existing.state,
          pincode: pincode !== undefined ? pincode.trim() : existing.pincode,
        }
      });
    } else {
      const generatedUid = `neon_usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      updatedProfile = await prisma.profile.create({
        data: {
          firebaseUid: targetUid || generatedUid,
          email: cleanEmail,
          phone: cleanPhone,
          fullName: fullName?.trim() || (cleanEmail ? cleanEmail.split('@')[0] : 'Commercial Buyer'),
          companyName: companyName ? companyName.trim() : null,
          gstin: gstin ? gstin.trim().toUpperCase() : null,
          shippingAddress: shippingAddress ? shippingAddress.trim() : null,
          city: city ? city.trim() : null,
          state: state ? state.trim() : null,
          pincode: pincode ? pincode.trim() : null,
          role: 'CUSTOMER',
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Buyer profile and email setup updated successfully in Neon Cloud.',
      profile: updatedProfile
    });
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update profile settings.' },
      { status: 500 }
    );
  }
}
