import Link from "next/link";
import prisma from "@/app/lib/db";
import { BookingCard } from "@/app/components/BookingCard";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { requireRole } from "@/app/lib/auth";

async function getDashboardData() {
  noStore();
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const revenueToday = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: {
      createdAt: { gte: todayStart },
      status: { in: ["ACTIVE", "COMPLETED"] },
    },
  });

  const totalRooms = await prisma.karaokeRoom.count();
  const availableRooms = await prisma.karaokeRoom.count({ where: { status: "AVAILABLE" } });
  const activeRooms = await prisma.karaokeRoom.count({ where: { status: "USING" } });
  const cleaningRooms = await prisma.karaokeRoom.count({ where: { status: "CLEANING" } });
  const maintenanceRooms = await prisma.karaokeRoom.count({ where: { status: "MAINTENANCE" } });
  const standardRooms = await prisma.karaokeRoom.count({ where: { roomType: "STANDARD" } });
  const vipRooms = await prisma.karaokeRoom.count({ where: { roomType: "VIP" } });
  const luxuryRooms = await prisma.karaokeRoom.count({ where: { roomType: "LUXURY" } });
  const recentBookings = await prisma.booking.findMany({
    include: {
      room: { select: { name: true } },
      customer: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    revenueToday: revenueToday._sum.totalPrice ?? 0,
    availableRooms,
    activeRooms,
    cleaningRooms,
    maintenanceRooms,
    standardRooms,
    vipRooms,
    luxuryRooms,
    totalRooms,
    recentBookings,
  };
}

export default async function DashboardPage() {
  const currentUser = await requireRole();
  const user = currentUser.kindeUser;

  const { revenueToday, availableRooms, activeRooms, cleaningRooms, maintenanceRooms, standardRooms, vipRooms, luxuryRooms, totalRooms, recentBookings } = await getDashboardData();

  return (
    <div className="container mx-auto px-5 py-8 lg:px-10">
      <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">
              {(currentUser.dbUser.role === "ADMIN" ? "Administrator" : "Manager") + " dashboard"}
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Realtime karaoke operations</h1>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              Welcome back, {(user as any)?.given_name ?? (user as any)?.name ?? "Manager"}
            </div>
            <Button asChild size="sm">
              <Link href="/rooms/new">Add new room</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 text-white shadow-xl shadow-slate-950/10">
          <p className="text-sm text-slate-400">Revenue today</p>
          <p className="mt-4 text-3xl font-semibold">${revenueToday}</p>
        </div>
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 text-white shadow-xl shadow-slate-950/10">
          <p className="text-sm text-slate-400">Available rooms</p>
          <p className="mt-4 text-3xl font-semibold">{availableRooms}</p>
        </div>
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 text-white shadow-xl shadow-slate-950/10">
          <p className="text-sm text-slate-400">Active rooms</p>
          <p className="mt-4 text-3xl font-semibold">{activeRooms}</p>
        </div>
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 text-white shadow-xl shadow-slate-950/10">
          <p className="text-sm text-slate-400">Total rooms</p>
          <p className="mt-4 text-3xl font-semibold">{totalRooms}</p>
        </div>
      </div>

      <section className="mt-10 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Room inventory</h2>
            <p className="mt-2 text-slate-400">Track current room status across the karaoke lounge.</p>
          </div>
          <Button asChild size="sm">
            <Link href="/rooms">View rooms</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-white shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Available</p>
            <p className="mt-4 text-3xl font-semibold">{availableRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Ready for walk-in booking</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-white shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Using</p>
            <p className="mt-4 text-3xl font-semibold">{activeRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Currently occupied</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-white shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Cleaning</p>
            <p className="mt-4 text-3xl font-semibold">{cleaningRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Needs reset before next guest</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-white shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Maintenance</p>
            <p className="mt-4 text-3xl font-semibold">{maintenanceRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Under technical review</p>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Room type breakdown</h2>
            <p className="mt-2 text-slate-400">See how many standard, VIP, and luxury rooms are currently listed.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-white shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Standard rooms</p>
            <p className="mt-4 text-3xl font-semibold">{standardRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Everyday lounge spaces for general groups.</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-white shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">VIP rooms</p>
            <p className="mt-4 text-3xl font-semibold">{vipRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Premium booths for exclusive reservations.</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-white shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Luxury rooms</p>
            <p className="mt-4 text-3xl font-semibold">{luxuryRooms}</p>
            <p className="mt-2 text-sm text-slate-500">Top-tier rooms with the best sound and amenities.</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Recent Bookings</h2>
        <p className="mt-2 text-slate-400">Latest activity for room reservations and customer check-ins.</p>
        <div className="mt-6 grid gap-6">
          {recentBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              id={booking.id}
              roomName={booking.room?.name ?? "Unknown room"}
              startTime={booking.startTime.toISOString()}
              endTime={booking.endTime.toISOString()}
              totalHours={booking.totalHours}
              totalPrice={booking.totalPrice}
              status={booking.status}
              customerName={`${booking.customer?.firstName ?? "Customer"} ${booking.customer?.lastName ?? ""}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
