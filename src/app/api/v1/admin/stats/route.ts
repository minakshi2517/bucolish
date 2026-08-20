import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalSwipes = await prisma.swipe.count();
    const totalMatches = await prisma.match.count();
    const totalMessages = await prisma.message.count();
    const pendingReports = await prisma.report.count({ where: { status: 'PENDING' } });
    const verifiedUsers = await prisma.verification.count({ where: { overallStatus: 'VERIFIED' } });

    const recentReports = await prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, phone: true } },
        reported: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalSwipes,
        totalMatches,
        totalMessages,
        pendingReports,
        verifiedUsers,
      },
      recentReports,
    });
  } catch (error: any) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch admin stats' }, { status: 500 });
  }
}
