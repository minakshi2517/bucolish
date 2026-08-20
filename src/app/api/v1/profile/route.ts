import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      intent,
      age,
      gender,
      occupation,
      company,
      bio,
      promptQuestion,
      promptAnswer,
      photos,
      budgetMin,
      budgetMax,
      preferredCity,
      preferredLocations,
      housing,
    } = body;

    // Update base user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: name !== undefined ? name : currentUser.name,
        intent: intent !== undefined ? intent : currentUser.intent,
        isOnboarded: true,
        avatar: photos && photos.length > 0 ? photos[0] : currentUser.avatar,
      },
    });

    // Update Profile
    await prisma.profile.upsert({
      where: { userId: currentUser.id },
      update: {
        age: age ? parseInt(age) : undefined,
        gender,
        occupation,
        company,
        bio,
        promptQuestion,
        promptAnswer,
        photos: photos ? JSON.stringify(photos) : undefined,
        budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
        budgetMax: budgetMax ? parseInt(budgetMax) : undefined,
        preferredCity: preferredCity || 'Gurugram',
        preferredLocations: preferredLocations ? JSON.stringify(preferredLocations) : undefined,
      },
      create: {
        userId: currentUser.id,
        age: age ? parseInt(age) : 25,
        gender: gender || 'MALE',
        occupation: occupation || 'Professional',
        company: company || 'Gurugram Tech Hub',
        bio: bio || 'Excited to find a great flatmate!',
        promptQuestion,
        promptAnswer,
        photos: JSON.stringify(photos || ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80']),
        budgetMin: budgetMin ? parseInt(budgetMin) : 15000,
        budgetMax: budgetMax ? parseInt(budgetMax) : 30000,
        preferredCity: preferredCity || 'Gurugram',
        preferredLocations: JSON.stringify(preferredLocations || ['DLF Phase 4']),
      },
    });

    // Update Housing Profile if user has a flat
    if (housing && (intent === 'HAVE_FLAT_NEED_FLATMATE' || currentUser.intent === 'HAVE_FLAT_NEED_FLATMATE')) {
      await prisma.housingProfile.upsert({
        where: { userId: currentUser.id },
        update: {
          title: housing.title || 'Spacious Flat in Gurugram',
          description: housing.description || '',
          photos: JSON.stringify(housing.photos || []),
          city: housing.city || 'Gurugram',
          sector: housing.sector || 'DLF Phase 4',
          landmark: housing.landmark,
          rent: parseInt(housing.rent) || 20000,
          deposit: parseInt(housing.deposit) || 40000,
          flatType: housing.flatType || '2BHK',
          furnishing: housing.furnishing || 'Fully Furnished',
          availableRoom: housing.availableRoom || 'Private Bedroom',
          totalFlatmates: parseInt(housing.totalFlatmates) || 2,
          availableFrom: housing.availableFrom ? new Date(housing.availableFrom) : new Date(),
          amenities: JSON.stringify(housing.amenities || ['High-speed WiFi', 'AC', 'Power Backup']),
        },
        create: {
          userId: currentUser.id,
          title: housing.title || 'Spacious Flat in Gurugram',
          description: housing.description || '',
          photos: JSON.stringify(housing.photos || []),
          city: housing.city || 'Gurugram',
          sector: housing.sector || 'DLF Phase 4',
          landmark: housing.landmark,
          rent: parseInt(housing.rent) || 20000,
          deposit: parseInt(housing.deposit) || 40000,
          flatType: housing.flatType || '2BHK',
          furnishing: housing.furnishing || 'Fully Furnished',
          availableRoom: housing.availableRoom || 'Private Bedroom',
          totalFlatmates: parseInt(housing.totalFlatmates) || 2,
          availableFrom: housing.availableFrom ? new Date(housing.availableFrom) : new Date(),
          amenities: JSON.stringify(housing.amenities || ['High-speed WiFi', 'AC', 'Power Backup']),
        },
      });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        profile: true,
        housingProfile: true,
        lifestyleAnswers: true,
        preferences: true,
        verification: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: fullUser,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
