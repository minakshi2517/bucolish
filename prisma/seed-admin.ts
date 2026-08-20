import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up official Bucolish Founder & Admin account...');

  const adminEmail = 'admin@bucolish.com';
  const adminPhone = '+919999999999';
  const adminPassword = 'Bucolish@Admin2026';

  const admin = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {
      email: adminEmail,
      name: 'Founder & Admin',
      password: adminPassword,
      role: 'ADMIN',
      isOnboarded: true,
    },
    create: {
      email: adminEmail,
      phone: adminPhone,
      name: 'Founder & Admin',
      password: adminPassword,
      role: 'ADMIN',
      isOnboarded: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
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

  console.log('✓ Founder Admin account created successfully:');
  console.log('--------------------------------------------');
  console.log(`Admin Email:    ${adminEmail}`);
  console.log(`Admin Password: ${adminPassword}`);
  console.log(`Admin Phone:    ${adminPhone}`);
  console.log('--------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
