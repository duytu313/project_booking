import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { requireRole } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;

    const rooms = await prisma.karaokeRoom.findMany({
      where: {
        roomType: type ? type.toUpperCase() as any : undefined,
        status: status ? status.toUpperCase() as any : undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: "Unable to load rooms" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await requireRole();

  try {
    const payload = await req.json();
    const room = await prisma.karaokeRoom.create({
      data: {
        name: payload.name,
        description: payload.description,
        pricePerHour: Number(payload.pricePerHour),
        roomType: payload.roomType || "STANDARD",
        capacity: Number(payload.capacity) || 4,
        status: payload.status || "AVAILABLE",
        images: payload.images || [],
        managerId: payload.managerId || undefined,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create room" }, { status: 500 });
  }
}
