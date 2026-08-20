import { NextRequest, NextResponse } from 'next/server';

const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }

    const email = (body.email || '').toLowerCase().trim();
    const phone = (body.phone || '').trim();
    const target = email || phone;

    if (!target) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(target, { code: generatedOtp, expiresAt });

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${target}`,
      email: target,
      previewCode: generatedOtp,
    });
  } catch (error: any) {
    console.error('Request Email OTP Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send verification code' }, { status: 500 });
  }
}

export { otpStore };
