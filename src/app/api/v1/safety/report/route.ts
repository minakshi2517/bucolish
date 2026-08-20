import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportedId, reason, description } = await req.json();

    if (!reportedId || !reason) {
      return NextResponse.json({ error: 'Reported user ID and reason are required' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: currentUser.id,
        reportedId,
        reason,
        description: description || 'No additional details provided.',
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Our Trust & Safety team will review within 24 hours.',
      reportId: report.id,
    });
  } catch (error) {
    console.error('Report API Error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
