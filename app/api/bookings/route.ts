import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId") || undefined;

    const bookings = await prisma.booking.findMany({
      where: {
        customerId: customerId || undefined,
      },
      include: {
        room: true,
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Unable to load bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const startTime = new Date(payload.startTime);
    const endTime = new Date(payload.endTime);
    const room = await prisma.karaokeRoom.findUnique({ where: { id: payload.roomId } });

    if (!room || Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      return NextResponse.json({ error: "Invalid booking request" }, { status: 400 });
    }

    const diff = Math.max(0, endTime.getTime() - startTime.getTime());
    const totalHours = Math.max(1, Math.round((diff / (1000 * 60 * 60)) * 100) / 100);
    const totalPrice = Math.ceil(totalHours * room.pricePerHour);

    const booking = await prisma.booking.create({
      data: {
        customerId: payload.customerId,
        roomId: payload.roomId,
        startTime,
        endTime,
        totalHours,
        totalPrice,
        status: payload.status || "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create booking" }, { status: 500 });
  }
}
