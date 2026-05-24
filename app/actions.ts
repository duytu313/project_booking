"use server";

import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { requireAuth, requireRole } from "./lib/auth";
import { BookingStatus, RoomStatus, RoomType } from "@prisma/client";

export async function createBooking(formData: FormData) {
  const currentUser = await requireAuth();

  const roomId = formData.get("roomId") as string;

  const startTime = new Date(
    formData.get("startTime") as string
  );

  const endTime = new Date(
    formData.get("endTime") as string
  );

  if (
    !roomId ||
    isNaN(startTime.getTime()) ||
    isNaN(endTime.getTime())
  ) {
    return redirect("/rooms");
  }

  const room = await prisma.karaokeRoom.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    return redirect("/rooms");
  }

  const diff =
    endTime.getTime() - startTime.getTime();

  const totalHours = Math.max(
    1,
    Math.round((diff / (1000 * 60 * 60)) * 100) /
      100
  );

  const totalPrice = Math.ceil(
    totalHours * room.pricePerHour
  );

  const now = new Date();

  const bookingStatus =
    startTime <= now && endTime > now
      ? BookingStatus.ACTIVE
      : BookingStatus.PENDING;

  await prisma.booking.create({
    data: {
      customerId: currentUser.dbUser.id,

      roomId,

      startTime,

      endTime,

      totalHours,

      totalPrice,

      status: bookingStatus,
    },
  });

  if (bookingStatus === BookingStatus.ACTIVE) {
    await prisma.karaokeRoom.update({
      where: {
        id: roomId,
      },

      data: {
        status: RoomStatus.USING,
      },
    });
  }

  return redirect("/bookings");
}

export async function createRoom(formData: FormData) {
  const currentUser = await requireRole();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const pricePerHour = Number(
    formData.get("pricePerHour") || 0
  );

  const roomType = String(
    formData.get("roomType") || "STANDARD"
  ) as RoomType;

  const capacity = Number(
    formData.get("capacity") || 4
  );

  const rawImages = String(
    formData.get("images") || ""
  );

  const images = rawImages
    .split(",")
    .map((item) => item.trim())
    .filter(
      (item) =>
        item.startsWith("https://") &&
        !item.includes("unsplash.com/photos/")
    );

  if (
    !name ||
    !description ||
    pricePerHour <= 0 ||
    capacity <= 0
  ) {
    return redirect("/rooms/new");
  }

  await prisma.karaokeRoom.create({
    data: {
      name,

      description,

      pricePerHour,

      roomType,

      capacity,

      images,

      status: RoomStatus.AVAILABLE,

      managerId: currentUser.dbUser.id,
    },
  });

  return redirect("/dashboard");
}