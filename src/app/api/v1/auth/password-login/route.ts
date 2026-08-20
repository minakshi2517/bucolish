import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }

    const identifier = (body.identifier || body.email || body.phone || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email / Username and password are required' }, { status: 400 });
    }

    // Find user by email, phone, or name
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { name: identifier },
        ],
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
      return NextResponse.json({ error: 'No account found with this Email / Username. Please sign up.' }, { status: 404 });
    }

    if (user.password && user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    // If user didn't have password set before, update it with this password
    if (!user.password && password) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password },
      });
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
    console.error('Password Login Error:', error);
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 500 });
  }
}
