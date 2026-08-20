import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateCompatibility } from '@/lib/compatibility';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetId, action } = await req.json(); // action: LIKE, PASS, SUPER_LIKE
    if (!targetId || !action) {
      return NextResponse.json({ error: 'Target ID and action required' }, { status: 400 });
    }

    // 1. Record the swipe
    const swipe = await prisma.swipe.upsert({
      where: {
        swiperId_targetId: {
          swiperId: currentUser.id,
          targetId,
        },
      },
      update: { action },
      create: {
        swiperId: currentUser.id,
        targetId,
        action,
      },
    });

    let isMatch = false;
    let matchData = null;

    // 2. If LIKE or SUPER_LIKE, check if target also swiped right on currentUser
    if (action === 'LIKE' || action === 'SUPER_LIKE') {
      const mutualSwipe = await prisma.swipe.findFirst({
        where: {
          swiperId: targetId,
          targetId: currentUser.id,
          action: { in: ['LIKE', 'SUPER_LIKE'] },
        },
      });

      if (mutualSwipe) {
        isMatch = true;

        // Fetch target user details for scoring
        const targetUser = await prisma.user.findUnique({
          where: { id: targetId },
          include: {
            profile: true,
            housingProfile: true,
            lifestyleAnswers: true,
            verification: true,
          },
        });

        const comp = targetUser
          ? calculateCompatibility(
              {
                profile: currentUser.profile,
                lifestyleAnswers: currentUser.lifestyleAnswers,
                verification: currentUser.verification,
                housingProfile: currentUser.housingProfile,
              },
              {
                profile: targetUser.profile,
                lifestyleAnswers: targetUser.lifestyleAnswers,
                verification: targetUser.verification,
                housingProfile: targetUser.housingProfile,
              }
            )
          : { overallScore: 85 };

        // Ensure user1Id < user2Id or consistent order
        const [u1, u2] = currentUser.id < targetId ? [currentUser.id, targetId] : [targetId, currentUser.id];

        // Create or find Match record
        let match = await prisma.match.findFirst({
          where: { user1Id: u1, user2Id: u2 },
        });

        if (!match) {
          match = await prisma.match.create({
            data: {
              user1Id: u1,
              user2Id: u2,
              compatibilityScore: comp.overallScore,
              conversation: {
                create: {},
              },
            },
            include: {
              conversation: true,
            },
          });
        }

        // Create notification for target user
        await prisma.notification.create({
          data: {
            userId: targetId,
            title: "It's a Match!",
            body: `You and ${currentUser.name || 'someone'} matched with ${comp.overallScore}% compatibility!`,
            type: 'MATCH',
            linkUrl: `/matches`,
          },
        });

        matchData = {
          matchId: match.id,
          compatibilityScore: comp.overallScore,
          matchedUser: {
            id: targetUser?.id,
            name: targetUser?.name,
            avatar: targetUser?.avatar || (targetUser?.profile?.photos ? JSON.parse(targetUser.profile.photos)[0] : null),
            occupation: targetUser?.profile?.occupation,
          },
        };
      }
    }

    return NextResponse.json({
      success: true,
      swipe,
      isMatch,
      match: matchData,
    });
  } catch (error) {
    console.error('Swipe API Error:', error);
    return NextResponse.json({ error: 'Failed to record swipe' }, { status: 500 });
  }
}
