import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NoItems } from "@/app/components/NoItem";
import prisma from "@/app/lib/db";
import { createBooking } from "@/app/actions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";

async function getRoom(roomId: string) {
  noStore();

  return prisma.karaokeRoom.findUnique({
    where: { id: roomId },
  });
}

export default async function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const room = await getRoom(params.id);
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!room) {
    return (
      <div className="container mx-auto px-5 py-10 lg:px-10">
        <NoItems title="Room not found" description="The karaoke room you are looking for does not exist." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-slate-900">
            <Image
              src={room.images[0] ?? "https://images.unsplash.com/photo-1541807084-5c52b6b6cfe5?auto=format&fit=crop&w=1200&q=80"}
              alt={room.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">{room.roomType}</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">{room.name}</h1>
            </div>
            <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">
              {room.status}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Capacity</p>
              <p className="mt-2 text-xl font-semibold text-white">{room.capacity} guests</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Hourly rate</p>
              <p className="mt-2 text-xl font-semibold text-white">${room.pricePerHour}</p>
            </div>
          </div>

          <Separator className="border-slate-800" />

          <div className="space-y-4 text-slate-300">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Description</p>
            <p>{room.description ?? "This karaoke room delivers premium sound, mood lighting, and elevated service."}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Book by hour</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Reserve now</h2>
            </div>
            <form action={createBooking} className="space-y-5">
              <input type="hidden" name="roomId" value={room.id} />
              <input type="hidden" name="userId" value={user?.id ?? ""} />

              <label className="block text-sm font-medium text-slate-300">
                Start time
                <input
                  required
                  name="startTime"
                  type="datetime-local"
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                End time
                <input
                  required
                  name="endTime"
                  type="datetime-local"
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
                />
              </label>
              {user?.id ? (
                <Button size="lg" className="w-full">Book room</Button>
              ) : (
                <Link href="/api/auth/login">
                  <Button size="lg" className="w-full">Login to Book</Button>
                </Link>
              )}
            </form>
          </div>
          <Separator className="my-6 border-slate-800" />
          <div className="space-y-3 text-slate-400">
            <p className="text-sm uppercase tracking-[0.18em]">Booking information</p>
            <p>Bookings are charged per full hour and will appear in your booking dashboard.</p>
            <p>Payment and service selection will be available after booking confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
