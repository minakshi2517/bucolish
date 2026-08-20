import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        housingProfile: true,
        lifestyleAnswers: true,
        verification: true,
        _count: {
          select: {
            sentSwipes: true,
            receivedSwipes: true,
            reportsFiled: true,
            reportsReceived: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u) => {
      let budgetStr = '₹15,000 - ₹30,000';
      if (u.profile?.budgetMin || u.profile?.budgetMax) {
        const bMin = u.profile.budgetMin ? `₹${u.profile.budgetMin.toLocaleString()}` : '₹10,000';
        const bMax = u.profile.budgetMax ? `₹${u.profile.budgetMax.toLocaleString()}` : '₹50,000';
        budgetStr = `${bMin} - ${bMax}`;
      }

      let sectorStr = 'Gurugram';
      if (u.housingProfile?.sector) {
        sectorStr = u.housingProfile.sector;
      } else if (u.profile?.preferredLocations) {
        try {
          const locs = JSON.parse(u.profile.preferredLocations);
          if (Array.isArray(locs) && locs.length > 0) sectorStr = locs.join(', ');
        } catch {}
      }

      return {
        id: u.id,
        name: u.name || 'Resident',
        phone: u.phone,
        email: u.email,
        avatar: u.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: u.role,
        status: u.role === 'BANNED' ? 'BANNED' : u.role === 'RESTRICTED' ? 'RESTRICTED' : 'ACTIVE',
        isOnboarded: u.isOnboarded,
        createdAt: u.createdAt,
        bio: u.profile?.bio || 'No bio provided yet',
        age: u.profile?.age || 24,
        occupation: u.profile?.occupation || 'Working Professional',
        company: u.profile?.company || 'Gurugram',
        budget: budgetStr,
        sector: sectorStr,
        kycStatus: u.verification?.overallStatus || 'UNVERIFIED',
        swipesCount: u._count?.sentSwipes || 0,
        reportsCount: u._count?.reportsReceived || 0,
      };
    });

    return NextResponse.json({ success: true, users: formatted });
  } catch (err: any) {
    console.error('Admin Users API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update User Status (BAN, RESTRICT, ACTIVATE, VERIFY, DELETE)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action, status, kycStatus } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (action === 'DELETE') {
      await prisma.user.delete({
        where: { id: userId },
      });
      return NextResponse.json({ success: true, message: 'User deleted permanently' });
    }

    if (kycStatus) {
      await prisma.verification.upsert({
        where: { userId },
        create: {
          userId,
          idVerified: kycStatus,
          workVerified: kycStatus,
          overallStatus: kycStatus,
        },
        update: {
          idVerified: kycStatus,
          workVerified: kycStatus,
          overallStatus: kycStatus,
        },
      });
      return NextResponse.json({ success: true, message: `KYC updated to ${kycStatus}` });
    }

    if (status) {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          role: status === 'BANNED' ? 'BANNED' : status === 'RESTRICTED' ? 'RESTRICTED' : 'USER',
        },
      });
      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin Users PATCH Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
