import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning all demo test records from database...');

  // Delete all relational records in order
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.swipe.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.block.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.housingProfile.deleteMany({});
  await prisma.lifestyleAnswer.deleteMany({});
  await prisma.preference.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✓ Database is now 100% clean and fresh for real user registrations!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
