import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verification = await prisma.verification.findUnique({
      where: { userId: currentUser.id },
    });

    return NextResponse.json({
      success: true,
      verification: verification || {
        phoneVerified: true,
        idVerified: 'UNVERIFIED',
        workVerified: 'UNVERIFIED',
        overallStatus: 'PENDING',
      },
    });
  } catch (error) {
    console.error('Fetch Verification Error:', error);
    return NextResponse.json({ error: 'Failed to fetch verification status' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, docType, docUrl, workEmail } = await req.json(); // type: ID or WORK

    let updateData: any = {};
    if (type === 'ID') {
      updateData = {
        idVerified: 'VERIFIED',
        idDocType: docType || 'AADHAAR',
        idDocUrl: docUrl || 'verified_doc_mock.pdf',
        verifiedAt: new Date(),
      };
    } else if (type === 'WORK') {
      updateData = {
        workVerified: 'VERIFIED',
        workEmail: workEmail || 'corporate@company.com',
        verifiedAt: new Date(),
      };
    }

    const currentVer = await prisma.verification.findUnique({
      where: { userId: currentUser.id },
    });

    const isNowFullyVerified =
      (type === 'ID' || currentVer?.idVerified === 'VERIFIED') &&
      (type === 'WORK' || currentVer?.workVerified === 'VERIFIED');

    if (isNowFullyVerified) {
      updateData.overallStatus = 'VERIFIED';
    }

    const verification = await prisma.verification.upsert({
      where: { userId: currentUser.id },
      update: updateData,
      create: {
        userId: currentUser.id,
        phoneVerified: true,
        idVerified: type === 'ID' ? 'VERIFIED' : 'UNVERIFIED',
        idDocType: docType,
        idDocUrl: docUrl,
        workVerified: type === 'WORK' ? 'VERIFIED' : 'UNVERIFIED',
        workEmail,
        overallStatus: isNowFullyVerified ? 'VERIFIED' : 'PENDING',
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      verification,
      message: `${type === 'ID' ? 'Government ID' : 'Workplace'} verified successfully!`,
    });
  } catch (error) {
    console.error('Update Verification Error:', error);
    return NextResponse.json({ error: 'Failed to process verification' }, { status: 500 });
  }
}
