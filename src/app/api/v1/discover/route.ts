import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateCompatibility } from '@/lib/compatibility';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const genderFilter = searchParams.get('gender'); // MALE, FEMALE, ANY
    const maxBudget = searchParams.get('maxBudget') ? parseInt(searchParams.get('maxBudget')!) : null;
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const sectorFilter = searchParams.get('sector'); // e.g. "DLF Phase 4"

    // Get all users already swiped by currentUser
    const swipedUserIds = (
      await prisma.swipe.findMany({
        where: { swiperId: currentUser.id },
        select: { targetId: true },
      })
    ).map((s) => s.targetId);

    // Get all blocked or blocking users
    const blockedUserIds = (
      await prisma.block.findMany({
        where: {
          OR: [{ blockerId: currentUser.id }, { blockedId: currentUser.id }],
        },
        select: { blockerId: true, blockedId: true },
      })
    ).flatMap((b) => [b.blockerId, b.blockedId]);

    const excludeIds = Array.from(new Set([...swipedUserIds, ...blockedUserIds, currentUser.id]));

    // Fetch candidate users
    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        role: 'USER',
        isOnboarded: true,
      },
      include: {
        profile: true,
        housingProfile: true,
        lifestyleAnswers: true,
        preferences: true,
        verification: true,
      },
      take: 20,
    });

    // Score candidates and apply filters
    const scoredDeck = candidates
      .map((candidate) => {
        const compatibility = calculateCompatibility(
          {
            profile: currentUser.profile,
            lifestyleAnswers: currentUser.lifestyleAnswers,
            verification: currentUser.verification,
            housingProfile: currentUser.housingProfile,
          },
          {
            profile: candidate.profile,
            lifestyleAnswers: candidate.lifestyleAnswers,
            verification: candidate.verification,
            housingProfile: candidate.housingProfile,
          }
        );

        return {
          user: {
            id: candidate.id,
            name: candidate.name,
            phone: candidate.phone,
            avatar: candidate.avatar,
            intent: candidate.intent,
            profile: candidate.profile,
            housingProfile: candidate.housingProfile,
            lifestyleAnswers: candidate.lifestyleAnswers,
            verification: candidate.verification,
          },
          compatibility,
        };
      })
      .filter((item) => {
        // Hard Filter: Gender
        if (genderFilter && genderFilter !== 'ANY' && item.user.profile?.gender !== genderFilter) {
          return false;
        }
        // Hard Filter: Max Budget
        if (maxBudget) {
          const candidateBudget = item.user.housingProfile
            ? item.user.housingProfile.rent
            : item.user.profile?.budgetMax || 999999;
          if (candidateBudget > maxBudget) return false;
        }
        // Hard Filter: Verified Only
        if (verifiedOnly && item.user.verification?.overallStatus !== 'VERIFIED') {
          return false;
        }
        // Hard Filter: Sector
        if (sectorFilter && sectorFilter !== 'ALL') {
          if (item.user.housingProfile) {
            if (item.user.housingProfile.sector !== sectorFilter) return false;
          } else {
            try {
              const locs: string[] = JSON.parse(item.user.profile?.preferredLocations || '[]');
              if (!locs.includes(sectorFilter)) return false;
            } catch {
              return false;
            }
          }
        }
        return true;
      })
      .sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);

    return NextResponse.json({
      success: true,
      count: scoredDeck.length,
      deck: scoredDeck,
    });
  } catch (error) {
    console.error('Discover API Error:', error);
    return NextResponse.json({ error: 'Failed to generate discovery deck' }, { status: 500 });
  }
}
