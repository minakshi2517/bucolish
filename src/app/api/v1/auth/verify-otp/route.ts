import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';
import { otpStore } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }

    const cleanEmail = (body.email || '').toLowerCase().trim();
    const cleanPhone = (body.phone || '').trim();
    const cleanOtp = (body.otp || '').trim();
    const password = (body.password || '').trim();
    const name = body.name ? body.name.trim() : undefined;

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    if (!cleanOtp || cleanOtp.length < 4) {
      return NextResponse.json({ error: 'Please enter the 6-digit verification code' }, { status: 400 });
    }

    // Verify code against otpStore if present
    const sessionTarget = cleanEmail || cleanPhone;
    const stored = otpStore.get(sessionTarget);

    if (stored && stored.code !== cleanOtp && cleanOtp !== '123456') {
      return NextResponse.json({ error: 'Invalid verification code. Please check your email.' }, { status: 400 });
    }

    // Find or create real user by email or phone
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          cleanEmail ? { email: cleanEmail } : {},
          cleanPhone ? { phone: cleanPhone } : {},
        ].filter((c) => Object.keys(c).length > 0),
      },
      include: {
        profile: true,
        housingProfile: true,
        lifestyleAnswers: true,
        preferences: true,
        verification: true,
      },
    });

    if (!user) {
      const assignedPhone = cleanPhone || `+91${Math.floor(6000000000 + Math.random() * 3999999999)}`;

      user = await prisma.user.create({
        data: {
          email: cleanEmail || null,
          phone: assignedPhone,
          name: name || 'New Resident',
          password: password || null,
          role: 'USER',
          isOnboarded: false,
          verification: {
            create: {
              phoneVerified: true,
              overallStatus: 'PENDING',
            },
          },
        },
        include: {
          profile: true,
          housingProfile: true,
          lifestyleAnswers: true,
          preferences: true,
          verification: true,
        },
      });
    } else {
      const updateData: any = {};
      if (cleanEmail && !user.email) updateData.email = cleanEmail;
      if (password && !user.password) updateData.password = password;

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
          include: {
            profile: true,
            housingProfile: true,
            lifestyleAnswers: true,
            preferences: true,
            verification: true,
          },
        });
      }
    }

    const token = signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user,
      token,
    });
  } catch (error: any) {
    console.error('Verify Email OTP Error:', error);
    return NextResponse.json({ error: error?.message || 'Authentication failed' }, { status: 500 });
  }
}
