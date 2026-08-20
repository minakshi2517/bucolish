import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone is required to switch' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        profile: true,
        housingProfile: true,
        lifestyleAnswers: true,
        preferences: true,
        verification: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
  } catch (error) {
    console.error('Switch User Error:', error);
    return NextResponse.json({ error: 'Failed to switch user' }, { status: 500 });
  }
}
