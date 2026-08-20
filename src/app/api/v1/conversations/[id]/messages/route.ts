import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        match: {
          include: {
            user1: {
              include: {
                profile: true,
                housingProfile: true,
                verification: true,
              },
            },
            user2: {
              include: {
                profile: true,
                housingProfile: true,
                verification: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if user is participant
    if (
      conversation.match.user1Id !== currentUser.id &&
      conversation.match.user2Id !== currentUser.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const otherUser =
      conversation.match.user1Id === currentUser.id
        ? conversation.match.user2
        : conversation.match.user1;

    // Mark other user's unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: otherUser.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      matchId: conversation.match.id,
      compatibilityScore: conversation.match.compatibilityScore,
      user1ContactShared: conversation.user1ContactShared,
      user2ContactShared: conversation.user2ContactShared,
      isMutualContactShared:
        conversation.user1ContactShared && conversation.user2ContactShared,
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        phone:
          conversation.user1ContactShared && conversation.user2ContactShared
            ? otherUser.phone
            : undefined,
        avatar: otherUser.avatar,
        occupation: otherUser.profile?.occupation,
        housing: otherUser.housingProfile,
        verification: otherUser.verification,
      },
      messages: conversation.messages.map((m) => ({
        id: m.id,
        content: m.content,
        msgType: m.msgType,
        metaData: m.metaData ? JSON.parse(m.metaData) : null,
        senderId: m.senderId,
        isMine: m.senderId === currentUser.id,
        isRead: m.isRead,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error('Fetch Messages Error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const { content, msgType = 'TEXT', metaData } = await req.json();

    if (!content && !metaData) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        match: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (
      conversation.match.user1Id !== currentUser.id &&
      conversation.match.user2Id !== currentUser.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const otherUserId =
      conversation.match.user1Id === currentUser.id
        ? conversation.match.user2Id
        : conversation.match.user1Id;

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUser.id,
        content: content || '',
        msgType,
        metaData: metaData ? JSON.stringify(metaData) : null,
      },
    });

    // If contact sharing action
    if (msgType === 'CONTACT_SHARE') {
      if (conversation.match.user1Id === currentUser.id) {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { user1ContactShared: true },
        });
      } else {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { user2ContactShared: true },
        });
      }
    }

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: otherUserId,
        title: `New message from ${currentUser.name || 'Flatmate'}`,
        body: content ? (content.length > 50 ? content.substring(0, 47) + '...' : content) : 'Sent you a special request',
        type: 'MESSAGE',
        linkUrl: `/chat/${conversationId}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        msgType: message.msgType,
        metaData: message.metaData ? JSON.parse(message.metaData) : null,
        senderId: message.senderId,
        isMine: true,
        isRead: message.isRead,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
