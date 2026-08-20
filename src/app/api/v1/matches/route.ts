import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all matches involving currentUser
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: currentUser.id }, { user2Id: currentUser.id }],
      },
      include: {
        user1: {
          include: {
            profile: true,
            housingProfile: true,
            lifestyleAnswers: true,
            verification: true,
          },
        },
        user2: {
          include: {
            profile: true,
            housingProfile: true,
            lifestyleAnswers: true,
            verification: true,
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const newMatches: any[] = [];
    const conversations: any[] = [];

    matches.forEach((m) => {
      const otherUser = m.user1Id === currentUser.id ? m.user2 : m.user1;
      const lastMsg = m.conversation?.messages[0];

      let photos: string[] = [];
      try {
        photos = JSON.parse(otherUser.profile?.photos || '[]');
      } catch {
        photos = [];
      }

      const matchItem = {
        matchId: m.id,
        conversationId: m.conversation?.id,
        compatibilityScore: m.compatibilityScore,
        createdAt: m.createdAt,
        user: {
          id: otherUser.id,
          name: otherUser.name,
          phone: otherUser.phone,
          avatar: otherUser.avatar || photos[0] || null,
          photos,
          occupation: otherUser.profile?.occupation,
          company: otherUser.profile?.company,
          age: otherUser.profile?.age,
          housing: otherUser.housingProfile,
          verification: otherUser.verification,
          lifestyleAnswers: otherUser.lifestyleAnswers,
        },
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              msgType: lastMsg.msgType,
              createdAt: lastMsg.createdAt,
              isMine: lastMsg.senderId === currentUser.id,
              isRead: lastMsg.isRead,
            }
          : null,
      };

      if (!lastMsg) {
        newMatches.push(matchItem);
      } else {
        conversations.push(matchItem);
      }
    });

    return NextResponse.json({
      success: true,
      newMatches,
      conversations,
    });
  } catch (error) {
    console.error('Matches API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
