import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { requireRole } from "@/app/lib/auth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Unable to load services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await requireRole();

  try {
    const payload = await req.json();

    const service = await prisma.service.create({
      data: {
        name: payload.name,
        category: payload.category || "DRINKS",
        description: payload.description,
        price: Number(payload.price) || 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create service" }, { status: 500 });
  }
}
