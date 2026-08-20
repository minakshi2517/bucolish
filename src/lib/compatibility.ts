// BUCOLISH 6-Pillar Compatibility Scoring Engine

export interface UserScoreContext {
  profile?: {
    budgetMin?: number | null;
    budgetMax?: number | null;
    preferredLocations?: string | null; // JSON string array
    moveInDate?: string | Date | null;
    preferredCity?: string | null;
  } | null;
  lifestyleAnswers?: {
    cleanlinessLevel: number;
    choresSharing: string;
    cookingHabit: string;
    sleepSchedule: string;
    workArrangement: string;
    noiseTolerance: string;
    guestComfort: string;
    partyHabit: string;
    smokingPreference: string;
    drinkingHabit: string;
    petPreference: string;
    foodPreference: string;
  } | null;
  verification?: {
    phoneVerified: boolean;
    idVerified: string;
    workVerified: string;
  } | null;
  housingProfile?: {
    rent: number;
    sector: string;
    availableFrom: string | Date;
  } | null;
}

export interface CompatibilityBreakdown {
  overallScore: number;
  pillars: {
    budgetLogistics: { score: number; weight: number; label: string };
    cleanlinessHabits: { score: number; weight: number; label: string };
    scheduleNoise: { score: number; weight: number; label: string };
    socialStyle: { score: number; weight: number; label: string };
    valuesPreferences: { score: number; weight: number; label: string };
    verificationTrust: { score: number; weight: number; label: string };
  };
  highlights: string[];
  dealbreakers: string[];
}

export function calculateCompatibility(
  u1: UserScoreContext,
  u2: UserScoreContext
): CompatibilityBreakdown {
  const highlights: string[] = [];
  const dealbreakers: string[] = [];

  // --- 1. Budget & Logistics (25%) ---
  let budgetScore = 75; // baseline default
  const u1Min = u1.profile?.budgetMin || 10000;
  const u1Max = u1.profile?.budgetMax || 35000;
  const u2Min = u2.profile?.budgetMin || (u2.housingProfile ? u2.housingProfile.rent : 10000);
  const u2Max = u2.profile?.budgetMax || (u2.housingProfile ? u2.housingProfile.rent : 35000);

  // Check budget overlap
  const overlapMin = Math.max(u1Min, u2Min);
  const overlapMax = Math.min(u1Max, u2Max);

  if (overlapMin <= overlapMax) {
    budgetScore = 95;
    highlights.push('Budget ranges align perfectly');
  } else {
    const diff = overlapMin - overlapMax;
    if (diff < 5000) {
      budgetScore = 78;
    } else if (diff < 10000) {
      budgetScore = 55;
    } else {
      budgetScore = 35;
      dealbreakers.push('Significant budget mismatch');
    }
  }

  // Location overlap
  try {
    const loc1: string[] = JSON.parse(u1.profile?.preferredLocations || '[]');
    const loc2: string[] = u2.housingProfile
      ? [u2.housingProfile.sector]
      : JSON.parse(u2.profile?.preferredLocations || '[]');
    const shared = loc1.filter((l) => loc2.includes(l));
    if (shared.length > 0) {
      budgetScore = Math.min(100, budgetScore + 5);
      highlights.push(`Both prefer ${shared[0]}`);
    }
  } catch {
    // fallback
  }

  // --- 2. Cleanliness & Habits (20%) ---
  let cleanScore = 80;
  const c1 = u1.lifestyleAnswers?.cleanlinessLevel || 3;
  const c2 = u2.lifestyleAnswers?.cleanlinessLevel || 3;
  const diffClean = Math.abs(c1 - c2);

  if (diffClean === 0) {
    cleanScore = 98;
    highlights.push('Identical cleanliness standards');
  } else if (diffClean === 1) {
    cleanScore = 85;
  } else if (diffClean === 2) {
    cleanScore = 65;
  } else {
    cleanScore = 40;
    dealbreakers.push('Cleanliness expectations differ');
  }

  if (
    u1.lifestyleAnswers?.choresSharing &&
    u1.lifestyleAnswers.choresSharing === u2.lifestyleAnswers?.choresSharing
  ) {
    cleanScore = Math.min(100, cleanScore + 5);
  }

  // --- 3. Schedule & Noise (15%) ---
  let scheduleScore = 80;
  const s1 = u1.lifestyleAnswers?.sleepSchedule;
  const s2 = u2.lifestyleAnswers?.sleepSchedule;
  if (s1 && s2) {
    if (s1 === s2) {
      scheduleScore = 95;
      if (s1.includes('Early')) highlights.push('Both early risers');
      if (s1.includes('Night')) highlights.push('Both night owls');
    } else if (s1.includes('Flexible') || s2.includes('Flexible')) {
      scheduleScore = 85;
    } else {
      scheduleScore = 55;
    }
  }

  const n1 = u1.lifestyleAnswers?.noiseTolerance;
  const n2 = u2.lifestyleAnswers?.noiseTolerance;
  if (n1 && n2 && n1 === n2) {
    scheduleScore = Math.min(100, scheduleScore + 5);
  }

  // --- 4. Social Style (15%) ---
  let socialScore = 80;
  const g1 = u1.lifestyleAnswers?.guestComfort;
  const g2 = u2.lifestyleAnswers?.guestComfort;
  if (g1 && g2) {
    if (g1 === g2) {
      socialScore = 95;
      highlights.push('Matching guest & party comfort');
    } else if (g1.includes('No') && g2.includes('Very open')) {
      socialScore = 45;
      dealbreakers.push('Opposite guest policies');
    } else {
      socialScore = 75;
    }
  }

  // --- 5. Values & Deal-breakers (15%) ---
  let valuesScore = 85;
  const sm1 = u1.lifestyleAnswers?.smokingPreference;
  const sm2 = u2.lifestyleAnswers?.smokingPreference;
  if (sm1 && sm2) {
    if (sm1.includes('Strict non-smoker') && sm2.includes('Smoker friendly')) {
      valuesScore -= 35;
      dealbreakers.push('Smoking policy mismatch');
    } else if (sm1 === sm2) {
      valuesScore += 5;
    }
  }

  const pet1 = u1.lifestyleAnswers?.petPreference;
  const pet2 = u2.lifestyleAnswers?.petPreference;
  if (pet1 && pet2) {
    if (pet1.includes('No pets') && pet2.includes('Has a pet')) {
      valuesScore -= 30;
      dealbreakers.push('Pet incompatibility');
    } else if (pet1.includes('Loves') || pet2.includes('Loves')) {
      highlights.push('Pet friendly');
    }
  }

  valuesScore = Math.max(30, Math.min(100, valuesScore));

  // --- 6. Verification & Trust (10%) ---
  let trustScore = 70;
  let verCount = 0;
  if (u2.verification?.phoneVerified) verCount += 1;
  if (u2.verification?.idVerified === 'VERIFIED') verCount += 2;
  if (u2.verification?.workVerified === 'VERIFIED') verCount += 2;

  if (verCount >= 4) {
    trustScore = 100;
    highlights.push('Fully ID & Workplace Verified');
  } else if (verCount >= 2) {
    trustScore = 85;
  } else {
    trustScore = 65;
  }

  // Weighted Average Calculation
  const overall = Math.round(
    budgetScore * 0.25 +
      cleanScore * 0.2 +
      scheduleScore * 0.15 +
      socialScore * 0.15 +
      valuesScore * 0.15 +
      trustScore * 0.1
  );

  return {
    overallScore: Math.min(99, Math.max(45, overall)),
    pillars: {
      budgetLogistics: {
        score: budgetScore,
        weight: 25,
        label: 'Budget & Location',
      },
      cleanlinessHabits: {
        score: cleanScore,
        weight: 20,
        label: 'Cleanliness & Habits',
      },
      scheduleNoise: {
        score: scheduleScore,
        weight: 15,
        label: 'Schedule & Noise',
      },
      socialStyle: {
        score: socialScore,
        weight: 15,
        label: 'Social & Guests',
      },
      valuesPreferences: {
        score: valuesScore,
        weight: 15,
        label: 'Lifestyle & Values',
      },
      verificationTrust: {
        score: trustScore,
        weight: 10,
        label: 'Trust & Verification',
      },
    },
    highlights: Array.from(new Set(highlights)).slice(0, 4),
    dealbreakers: Array.from(new Set(dealbreakers)),
  };
}
