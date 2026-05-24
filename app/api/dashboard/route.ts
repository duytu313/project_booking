import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { requireRole } from "@/app/lib/auth";

export async function GET() {
  await requireRole();
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const revenue = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: { gte: todayStart },
        status: { in: ["ACTIVE", "COMPLETED"] },
      },
    });

    const rooms = await prisma.karaokeRoom.findMany({
      select: { status: true, id: true },
    });

    const recentBookings = await prisma.booking.findMany({
      include: {
        room: { select: { name: true } },
        customer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const statusCounts = rooms.reduce(
      (acc, room) => ({
        ...acc,
        [room.status]: (acc[room.status] || 0) + 1,
      }),
      { AVAILABLE: 0, USING: 0, CLEANING: 0, MAINTENANCE: 0 }
    );

    return NextResponse.json({
      revenueToday: revenue._sum.totalPrice ?? 0,
      statusCounts,
      recentBookings,
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to load dashboard" }, { status: 500 });
  }
}
