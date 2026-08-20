import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      cleanlinessLevel = 4,
      choresSharing = 'Equal rota',
      cookingHabit = 'Sometimes',
      sleepSchedule = 'Early bird (10pm - 6am)',
      workArrangement = 'Hybrid',
      noiseTolerance = 'Moderate',
      guestComfort = 'Weekends only',
      partyHabit = 'Occasional gatherings',
      smokingPreference = 'Strict non-smoker',
      drinkingHabit = 'Social drinker',
      petPreference = 'Loves pets',
      foodPreference = 'Any',
    } = await req.json();

    // Dynamically build summary tags
    const summaryTags: string[] = [];
    if (cleanlinessLevel >= 4) summaryTags.push('Spick & Span');
    else summaryTags.push('Relaxed Cleanliness');

    if (sleepSchedule.includes('Early')) summaryTags.push('Early Riser');
    else if (sleepSchedule.includes('Night')) summaryTags.push('Night Owl');

    if (smokingPreference.includes('Strict')) summaryTags.push('Non-Smoker');
    else if (smokingPreference.includes('Balcony')) summaryTags.push('Balcony Smoker');

    if (petPreference.includes('Loves')) summaryTags.push('Pet Friendly');
    else if (petPreference.includes('Has a')) summaryTags.push('Pet Owner');

    if (workArrangement.includes('WFH')) summaryTags.push('WFH');
    else if (workArrangement.includes('Hybrid')) summaryTags.push('Hybrid');

    const lifestyle = await prisma.lifestyleAnswer.upsert({
      where: { userId: currentUser.id },
      update: {
        cleanlinessLevel,
        choresSharing,
        cookingHabit,
        sleepSchedule,
        workArrangement,
        noiseTolerance,
        guestComfort,
        partyHabit,
        smokingPreference,
        drinkingHabit,
        petPreference,
        foodPreference,
        summaryTags: JSON.stringify(summaryTags),
      },
      create: {
        userId: currentUser.id,
        cleanlinessLevel,
        choresSharing,
        cookingHabit,
        sleepSchedule,
        workArrangement,
        noiseTolerance,
        guestComfort,
        partyHabit,
        smokingPreference,
        drinkingHabit,
        petPreference,
        foodPreference,
        summaryTags: JSON.stringify(summaryTags),
      },
    });

    return NextResponse.json({
      success: true,
      lifestyle,
      summaryTags,
    });
  } catch (error) {
    console.error('Quiz Submit Error:', error);
    return NextResponse.json({ error: 'Failed to save quiz answers' }, { status: 500 });
  }
}
