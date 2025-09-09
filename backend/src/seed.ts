import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminHash = await bcrypt.hash('Admin@123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      name: 'Administrator Demo Account',
      email: 'admin@demo.com',
      address: 'HQ, 42 Admin Street, City, Country',
      role: 'ADMIN',
      passwordHash: adminHash
    }
  });

  // Owners
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@demo.com' },
    update: {},
    create: {
      name: 'Owner One Demonstration',
      email: 'owner1@demo.com',
      address: '11 Market Road, Demo City',
      role: 'OWNER',
      passwordHash: await bcrypt.hash('Owner@123!', 10)
    }
  });
  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@demo.com' },
    update: {},
    create: {
      name: 'Owner Two Demonstration',
      email: 'owner2@demo.com',
      address: '22 Market Road, Demo City',
      role: 'OWNER',
      passwordHash: await bcrypt.hash('Owner@123!', 10)
    }
  });

  // Stores
  const store1 = await prisma.store.upsert({
    where: { email: 'sunrise@store.com' },
    update: {},
    create: { name: 'Sunrise Grocers', email: 'sunrise@store.com', address: '101 Sunshine Ave', ownerId: owner1.id }
  });
  const store2 = await prisma.store.upsert({
    where: { email: 'moonlight@store.com' },
    update: {},
    create: { name: 'Moonlight Mart', email: 'moonlight@store.com', address: '202 Moon Blvd', ownerId: owner2.id }
  });

  // Users
  const u1 = await prisma.user.upsert({
    where: { email: 'user1@demo.com' },
    update: {},
    create: { name: 'Normal User One Demo', email: 'user1@demo.com', address: '1 User Lane', role: 'USER', passwordHash: await bcrypt.hash('User@123!', 10) }
  });
  const u2 = await prisma.user.upsert({
    where: { email: 'user2@demo.com' },
    update: {},
    create: { name: 'Normal User Two Demo', email: 'user2@demo.com', address: '2 User Lane', role: 'USER', passwordHash: await bcrypt.hash('User@123!', 10) }
  });

  // Ratings
  await prisma.rating.deleteMany(); // idempotent for demo
  await prisma.rating.createMany({
    data: [
      { storeId: store1.id, userId: u1.id, stars: 5 },
      { storeId: store1.id, userId: u2.id, stars: 4 },
      { storeId: store2.id, userId: u1.id, stars: 3 },
    ]
  });

  console.log('Seed complete. Admin: admin@demo.com / Admin@123!');
}

main().finally(async () => prisma.$disconnect());
