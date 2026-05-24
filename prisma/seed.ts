import { PrismaClient, RoomStatus, RoomType, ServiceCategory, UserRole, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.bookingService.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.karaokeRoom.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      id: "admin-0001",
      email: "tudo9912@gmail.com",
      firstName: "Alex",
      lastName: "Rey",
      role: UserRole.ADMIN,
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    },
  });

  const manager = await prisma.user.create({
    data: {
      id: "manager-0001",
      email: "manager@ktvplatform.com",
      firstName: "Mia",
      lastName: "Chen",
      role: UserRole.MANAGER,
      profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
    },
  });

  const customer = await prisma.user.create({
    data: {
      id: "customer-0001",
      email: "customer@ktvplatform.com",
      firstName: "Noah",
      lastName: "Park",
      role: UserRole.CUSTOMER,
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    },
  });

  const rooms = await prisma.karaokeRoom.createMany({
    data: [
      {
        name: "Neon Pulse Room",
        description: "A sleek VIP room with immersive sound, neon lighting, and premium cocktails.",
        roomType: RoomType.VIP,
        capacity: 8,
        status: RoomStatus.AVAILABLE,
        pricePerHour: 120,
        images: [
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1533777324565-a040eb52fac2?auto=format&fit=crop&w=1200&q=80",
        ],
        managerId: manager.id,
      },
      {
        name: "Crystal Lounge",
        description: "A luxury private room with velvet seating, extensive drink menu, and DJ-ready atmosphere.",
        roomType: RoomType.LUXURY,
        capacity: 12,
        status: RoomStatus.USING,
        pricePerHour: 180,
        images: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80",
        ],
        managerId: manager.id,
      },
      {
        name: "Retro Groove",
        description: "A fun Standard room for friends with classic KTV vibes and a compact stage.",
        roomType: RoomType.STANDARD,
        capacity: 5,
        status: RoomStatus.CLEANING,
        pricePerHour: 65,
        images: [
          "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
        ],
        managerId: manager.id,
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        name: "Signature Cocktail Set",
        category: ServiceCategory.DRINKS,
        description: "Three premium cocktails prepared with flair.",
        price: 45,
      },
      {
        name: "Snack Tower",
        category: ServiceCategory.SNACKS,
        description: "A curated platter of crunchy favorites for the group.",
        price: 28,
      },
      {
        name: "Fresh Fruit Bowl",
        category: ServiceCategory.FRUITS,
        description: "Seasonal fruit platter served chilled.",
        price: 22,
      },
      {
        name: "Party Combo",
        category: ServiceCategory.COMBO,
        description: "Drinks, snacks, and VIP table service bundle.",
        price: 95,
      },
    ],
  });

  const neonRoom = await prisma.karaokeRoom.findFirst({ where: { name: "Neon Pulse Room" } });
  if (neonRoom) {
    await prisma.booking.create({
      data: {
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        endTime: new Date(Date.now() - 1000 * 60 * 60),
        totalHours: 1,
        totalPrice: 120,
        status: BookingStatus.COMPLETED,
        customerId: customer.id,
        roomId: neonRoom.id,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
