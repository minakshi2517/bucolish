import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Bucolish database with realistic Gurugram flatmates and flats...');

  // Clean previous data
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.block.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.lifestyleAnswer.deleteMany();
  await prisma.housingProfile.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // User 1: Aryan Sharma (Searching for Flat & Flatmate in Gurugram)
  const user1 = await prisma.user.create({
    data: {
      phone: '+919876543210',
      name: 'Aryan Sharma',
      role: 'USER',
      intent: 'NEED_FLAT_AND_FLATMATE',
      isOnboarded: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      profile: {
        create: {
          age: 26,
          gender: 'MALE',
          occupation: 'Senior Product Designer',
          company: 'Zomato HQ',
          bio: 'Building products by day, exploring indie coffee spots by weekend. Looking for an easy-going flatmate who respects personal space & keeps common areas clean.',
          promptQuestion: 'My ideal Sunday in Gurugram',
          promptAnswer: 'Freshly brewed pour-over, cycling near Golf Course Road, and cooking pasta while listening to jazz.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
          ]),
          budgetMin: 18000,
          budgetMax: 28000,
          preferredCity: 'Gurugram',
          preferredLocations: JSON.stringify(['DLF Phase 4', 'DLF Phase 5', 'Golf Course Road', 'Sector 43']),
          moveInDate: new Date('2026-09-01'),
          leaseDuration: 12,
        },
      },
      lifestyleAnswers: {
        create: {
          cleanlinessLevel: 4,
          choresSharing: 'Equal rota',
          cookingHabit: 'Sometimes',
          sleepSchedule: 'Early bird (10pm - 6am)',
          workArrangement: 'Hybrid',
          noiseTolerance: 'Moderate',
          guestComfort: 'Weekends only',
          partyHabit: 'Occasional gatherings',
          smokingPreference: 'Strict non-smoker',
          drinkingHabit: 'Social drinker',
          petPreference: 'Loves pets',
          foodPreference: 'Any',
          summaryTags: JSON.stringify(['Early Riser', 'Spick & Span', 'Pet Friendly', 'Hybrid Worker']),
        },
      },
      preferences: {
        create: {
          preferredGender: 'ANY',
          minAge: 22,
          maxAge: 32,
          budgetMin: 15000,
          budgetMax: 30000,
          verifiedOnly: false,
          nonSmokerOnly: true,
          strictVegetarian: false,
          noPets: false,
        },
      },
      verification: {
        create: {
          phoneVerified: true,
          idVerified: 'VERIFIED',
          idDocType: 'AADHAAR',
          workVerified: 'VERIFIED',
          workEmail: 'aryan@zomato.com',
          overallStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
  });

  // User 2: Priya Nair (Has a beautiful 2BHK in DLF Phase 4, looking for 1 flatmate)
  const user2 = await prisma.user.create({
    data: {
      phone: '+919876543211',
      name: 'Priya Nair',
      role: 'USER',
      intent: 'HAVE_FLAT_NEED_FLATMATE',
      isOnboarded: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      profile: {
        create: {
          age: 25,
          gender: 'FEMALE',
          occupation: 'Consultant',
          company: 'McKinsey & Co',
          bio: 'Calm, organized, and love keeping home aesthetic with plants. Looking for a mature flatmate for my second master bedroom in Galleria DLF Phase 4.',
          promptQuestion: 'My flatmate non-negotiable is...',
          promptAnswer: 'Respecting quiet hours after 11 PM on weekdays and keeping kitchen spotless after cooking.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
          ]),
          budgetMin: 22000,
          budgetMax: 26000,
          preferredCity: 'Gurugram',
          preferredLocations: JSON.stringify(['DLF Phase 4']),
          moveInDate: new Date('2026-09-01'),
          leaseDuration: 12,
        },
      },
      housingProfile: {
        create: {
          title: 'Sunlit Master Bedroom in Luxury 2BHK near Galleria',
          description: 'Spacious 2BHK on 8th floor facing green belt. Fully furnished with high-speed 300mbps WiFi, power backup, modular kitchen, and smart TV. 3 mins walk from Galleria Market.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
          ]),
          city: 'Gurugram',
          sector: 'DLF Phase 4',
          landmark: 'Opposite Galleria Market',
          rent: 24000,
          deposit: 48000,
          flatType: '2BHK',
          furnishing: 'Fully Furnished',
          availableRoom: 'Master Bedroom with attached washroom & balcony',
          totalFlatmates: 2,
          availableFrom: new Date('2026-09-01'),
          amenities: JSON.stringify(['High-speed WiFi', '100% Power Backup', 'AC in all rooms', 'Daily Housekeeper', 'Washing Machine', 'Covered Parking', 'Gated Security 24x7']),
        },
      },
      lifestyleAnswers: {
        create: {
          cleanlinessLevel: 5,
          choresSharing: 'Maid does everything',
          cookingHabit: 'Order in / Meal service',
          sleepSchedule: 'Early bird (10pm - 6am)',
          workArrangement: 'Hybrid',
          noiseTolerance: 'Quiet zone',
          guestComfort: 'Weekends only',
          partyHabit: 'Never at home',
          smokingPreference: 'Strict non-smoker',
          drinkingHabit: 'Non-drinker',
          petPreference: 'Loves pets',
          foodPreference: 'Vegetarian',
          summaryTags: JSON.stringify(['Spick & Span', 'Early Riser', 'Strict Non-Smoker', 'Quiet Zone', 'Vegetarian']),
        },
      },
      preferences: {
        create: {
          preferredGender: 'ANY',
          minAge: 23,
          maxAge: 32,
          budgetMin: 20000,
          budgetMax: 28000,
          verifiedOnly: true,
          nonSmokerOnly: true,
          strictVegetarian: false,
          noPets: false,
        },
      },
      verification: {
        create: {
          phoneVerified: true,
          idVerified: 'VERIFIED',
          idDocType: 'PASSPORT',
          workVerified: 'VERIFIED',
          workEmail: 'priya.nair@mckinsey.com',
          overallStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
  });

  // User 3: Rohan Malhotra (Software Architect at Google, looking for luxury 3BHK sharing)
  const user3 = await prisma.user.create({
    data: {
      phone: '+919876543212',
      name: 'Rohan Malhotra',
      role: 'USER',
      intent: 'NEED_FLAT_AND_FLATMATE',
      isOnboarded: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      profile: {
        create: {
          age: 28,
          gender: 'MALE',
          occupation: 'Staff Software Engineer',
          company: 'Google Cyber City',
          bio: 'Tech lead, gym enthusiast, and weekend board gamer. Love good conversations over filter coffee. Work in Cyber City 3 days a week.',
          promptQuestion: 'I am usually...',
          promptAnswer: 'Either at the gym at 6 AM or fine-tuning my dual-monitor setup.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
          ]),
          budgetMin: 25000,
          budgetMax: 38000,
          preferredCity: 'Gurugram',
          preferredLocations: JSON.stringify(['Cyber City', 'DLF Phase 2', 'DLF Phase 3', 'Golf Course Road']),
          moveInDate: new Date('2026-09-15'),
          leaseDuration: 12,
        },
      },
      lifestyleAnswers: {
        create: {
          cleanlinessLevel: 4,
          choresSharing: 'Maid does everything',
          cookingHabit: 'Cook daily',
          sleepSchedule: 'Early bird (10pm - 6am)',
          workArrangement: 'Hybrid',
          noiseTolerance: 'Moderate',
          guestComfort: 'Any time with notice',
          partyHabit: 'Occasional gatherings',
          smokingPreference: 'Strict non-smoker',
          drinkingHabit: 'Social drinker',
          petPreference: 'Loves pets',
          foodPreference: 'Any',
          summaryTags: JSON.stringify(['Early Riser', 'Tidy', 'Tech Professional', 'Fitness Enthusiast']),
        },
      },
      preferences: {
        create: {
          preferredGender: 'ANY',
          minAge: 24,
          maxAge: 35,
          budgetMin: 22000,
          budgetMax: 40000,
          verifiedOnly: true,
          nonSmokerOnly: true,
          strictVegetarian: false,
          noPets: false,
        },
      },
      verification: {
        create: {
          phoneVerified: true,
          idVerified: 'VERIFIED',
          idDocType: 'AADHAAR',
          workVerified: 'VERIFIED',
          workEmail: 'rohanm@google.com',
          overallStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
  });

  // User 4: Ananya Sen (Architect & Interior Designer, has flat in Sector 56)
  const user4 = await prisma.user.create({
    data: {
      phone: '+919876543213',
      name: 'Ananya Sen',
      role: 'USER',
      intent: 'HAVE_FLAT_NEED_FLATMATE',
      isOnboarded: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      profile: {
        create: {
          age: 27,
          gender: 'FEMALE',
          occupation: 'Architect & Interior Designer',
          company: 'Studio Morph',
          bio: 'Designed my own 3BHK penthouse duplex with warm Scandinavian aesthetics and lots of natural light. Seeking a creative flatmate who appreciates good design.',
          promptQuestion: 'My flatmate non-negotiable is...',
          promptAnswer: 'No smoking indoors, clean as you go, and positive vibes only.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
          ]),
          budgetMin: 20000,
          budgetMax: 25000,
          preferredCity: 'Gurugram',
          preferredLocations: JSON.stringify(['Sector 56', 'Golf Course Ext']),
          moveInDate: new Date('2026-09-01'),
          leaseDuration: 12,
        },
      },
      housingProfile: {
        create: {
          title: 'Designer Private Room in Sector 56 with Terrace Access',
          description: 'Custom-designed Nordic style flat with 10ft ceilings, hardwood floors, bespoke workstation, and private terrace garden. Metro station is 400m away.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
          ]),
          city: 'Gurugram',
          sector: 'Sector 56',
          landmark: 'Near Rapid Metro Station',
          rent: 22000,
          deposit: 44000,
          flatType: '3BHK',
          furnishing: 'Fully Furnished',
          availableRoom: 'Private Room with Dedicated Bath',
          totalFlatmates: 2,
          availableFrom: new Date('2026-09-01'),
          amenities: JSON.stringify(['Terrace Garden', 'Smart Air Purifier', 'Dishwasher', '300mbps Fiber', 'Lift', 'Clubhouse Gym']),
        },
      },
      lifestyleAnswers: {
        create: {
          cleanlinessLevel: 5,
          choresSharing: 'Maid does everything',
          cookingHabit: 'Cook daily',
          sleepSchedule: 'Flexible',
          workArrangement: 'WFH full-time',
          noiseTolerance: 'Moderate',
          guestComfort: 'Weekends only',
          partyHabit: 'Occasional gatherings',
          smokingPreference: 'Balcony smoker',
          drinkingHabit: 'Social drinker',
          petPreference: 'Has a pet',
          foodPreference: 'Any',
          summaryTags: JSON.stringify(['Creative', 'Design Lover', 'Has a Golden Retriever', 'WFH']),
        },
      },
      preferences: {
        create: {
          preferredGender: 'FEMALE',
          minAge: 22,
          maxAge: 32,
          budgetMin: 18000,
          budgetMax: 26000,
          verifiedOnly: true,
          nonSmokerOnly: false,
          strictVegetarian: false,
          noPets: false,
        },
      },
      verification: {
        create: {
          phoneVerified: true,
          idVerified: 'VERIFIED',
          idDocType: 'PASSPORT',
          workVerified: 'VERIFIED',
          workEmail: 'ananya@studiomorph.in',
          overallStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
  });

  // User 5: Kabir Mehta (Fintech Analyst, looking for flatmate)
  const user5 = await prisma.user.create({
    data: {
      phone: '+919876543214',
      name: 'Kabir Mehta',
      role: 'USER',
      intent: 'NEED_FLAT_AND_FLATMATE',
      isOnboarded: true,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      profile: {
        create: {
          age: 24,
          gender: 'MALE',
          occupation: 'Financial Analyst',
          company: 'American Express',
          bio: 'Work near One Horizon Center. Friendly, love cricket on weekends, keep things calm and chill at home.',
          promptQuestion: 'My ideal Sunday is...',
          promptAnswer: 'Early morning run at Leisure Valley park, heavy brunch, and catching up on movies.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
          ]),
          budgetMin: 15000,
          budgetMax: 22000,
          preferredCity: 'Gurugram',
          preferredLocations: JSON.stringify(['Golf Course Road', 'Sector 43', 'Sector 28']),
          moveInDate: new Date('2026-09-01'),
          leaseDuration: 11,
        },
      },
      lifestyleAnswers: {
        create: {
          cleanlinessLevel: 4,
          choresSharing: 'Equal rota',
          cookingHabit: 'Sometimes',
          sleepSchedule: 'Night owl (2am - 10am)',
          workArrangement: 'Work from office',
          noiseTolerance: 'Moderate',
          guestComfort: 'Weekends only',
          partyHabit: 'Occasional gatherings',
          smokingPreference: 'Strict non-smoker',
          drinkingHabit: 'Social drinker',
          petPreference: 'Loves pets',
          foodPreference: 'Any',
          summaryTags: JSON.stringify(['Night Owl', 'Cricket Lover', 'Office Goer', 'Non-Smoker']),
        },
      },
      preferences: {
        create: {
          preferredGender: 'ANY',
          minAge: 21,
          maxAge: 30,
          budgetMin: 14000,
          budgetMax: 24000,
          verifiedOnly: false,
          nonSmokerOnly: true,
          strictVegetarian: false,
          noPets: false,
        },
      },
      verification: {
        create: {
          phoneVerified: true,
          idVerified: 'VERIFIED',
          idDocType: 'AADHAAR',
          workVerified: 'VERIFIED',
          workEmail: 'kabir@aexp.com',
          overallStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
  });

  // User 6: Admin User
  await prisma.user.create({
    data: {
      phone: '+919999999999',
      name: 'Bucolish Platform Admin',
      role: 'ADMIN',
      intent: 'JUST_EXPLORING',
      isOnboarded: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
      profile: {
        create: {
          age: 30,
          gender: 'OTHER',
          occupation: 'Platform Administrator',
          company: 'Bucolish HQ',
          bio: 'System Administrator account for platform moderation, trust & safety analytics.',
          photos: JSON.stringify([
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
          ]),
          preferredLocations: JSON.stringify(['Gurugram']),
        },
      },
      verification: {
        create: {
          phoneVerified: true,
          idVerified: 'VERIFIED',
          workVerified: 'VERIFIED',
          overallStatus: 'VERIFIED',
        },
      },
    },
  });

  console.log('Seed completed successfully! Created 6 users with rich housing & lifestyle profiles.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
