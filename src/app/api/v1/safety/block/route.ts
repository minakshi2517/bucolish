import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blockedId } = await req.json();

    if (!blockedId) {
      return NextResponse.json({ error: 'Blocked user ID is required' }, { status: 400 });
    }

    // Create block entry
    await prisma.block.upsert({
      where: {
        blockerId_blockedId: {
          blockerId: currentUser.id,
          blockedId,
        },
      },
      update: {},
      create: {
        blockerId: currentUser.id,
        blockedId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User blocked successfully.',
    });
  } catch (error) {
    console.error('Block API Error:', error);
    return NextResponse.json({ error: 'Failed to block user' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blocked = await prisma.block.findMany({
      where: { blockerId: currentUser.id },
      include: {
        blocked: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      blockedList: blocked.map((b) => b.blocked),
    });
  } catch (error) {
    console.error('Fetch Blocked API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch blocked users' }, { status: 500 });
  }
}
