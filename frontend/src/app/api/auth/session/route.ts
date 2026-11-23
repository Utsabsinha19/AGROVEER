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

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.exp && decoded.exp < Date.now()) {
        return NextResponse.json({ authenticated: false, profile: null, error: 'Session expired' });
      }

      // Fetch fresh profile from Neon PostgreSQL
      const profile = await prisma.profile.findFirst({
        where: {
          OR: [
            { id: decoded.userId },
            { firebaseUid: decoded.uid },
            { email: decoded.identifier },
            { phone: decoded.identifier },
          ],
        },
      });

      if (profile) {
        return NextResponse.json({ authenticated: true, profile });
      }

      // Fallback to decoded session claims if offline
      return NextResponse.json({
        authenticated: true,
        profile: {
          id: decoded.userId || `prof_${decoded.uid}`,
          firebaseUid: decoded.uid,
          fullName: decoded.fullName || 'Commercial Buyer',
          email: decoded.identifier.includes('@') ? decoded.identifier : null,
          phone: decoded.identifier.includes('@') ? null : decoded.identifier,
          role: decoded.role || 'CUSTOMER',
        },
      });
    } catch {
      return NextResponse.json({ authenticated: false, profile: null });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

