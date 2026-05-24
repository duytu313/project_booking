import { RoomCard } from "@/app/components/RoomCard";
import { NoItems } from "@/app/components/NoItem";
import { RealtimeRoomUpdates } from "@/app/components/RealtimeRoomUpdates";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";

type RoomsSearchParams = {
  roomType?: string;
  status?: string;
};

type StatusCounts = {
  AVAILABLE: number;
  USING: number;
  CLEANING: number;
  MAINTENANCE: number;
};

async function getRooms(searchParams?: RoomsSearchParams) {
  noStore();

  return prisma.karaokeRoom.findMany({
    where: {
      roomType: searchParams?.roomType
        ? searchParams.roomType.toUpperCase() as any
        : undefined,
      status: searchParams?.status
        ? searchParams.status.toUpperCase() as any
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams?: RoomsSearchParams;
}) {
  const rooms = await getRooms(searchParams);

  const statusCounts = rooms.reduce<StatusCounts>(
    (acc, room) => {
      acc[room.status] = (acc[room.status] || 0) + 1;
      return acc;
    },
    { AVAILABLE: 0, USING: 0, CLEANING: 0, MAINTENANCE: 0 }
  );

  return (
    <div className="container mx-auto px-5 py-8 lg:px-10">
      <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">KTV Management</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Luxury Karaoke Rooms</h1>
          <p className="text-slate-400">
            Explore the latest room inventory, manage availability, and book premium private rooms by the hour.
          </p>
        </div>

        <form method="get" className="mt-10 grid gap-4 sm:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Room type</span>
            <select
              name="roomType"
              defaultValue={searchParams?.roomType || ""}
              className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
            >
              <option value="">All</option>
              <option value="STANDARD">Standard</option>
              <option value="VIP">VIP</option>
              <option value="LUXURY">Luxury</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Room status</span>
            <select
              name="status"
              defaultValue={searchParams?.status || ""}
              className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
            >
              <option value="">All</option>
              <option value="AVAILABLE">Available</option>
              <option value="USING">Using</option>
              <option value="CLEANING">Cleaning</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-3xl bg-fuchsia-400 px-5 text-sm font-medium text-slate-950 transition hover:bg-fuchsia-300"
            >
              Apply filters
            </button>
            <a
              href="/rooms"
              className="inline-flex h-12 items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-900/90 px-5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Clear
            </a>
          </div>
        </form>

        <div className="mt-10">
          <RealtimeRoomUpdates initialCounts={statusCounts} />
        </div>
      </div>

      <section className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {rooms.length === 0 ? (
          <NoItems
            title="No karaoke rooms found"
            description="Please check your filters or add new rooms from the manager dashboard."
          />
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              roomId={room.id}
              name={room.name}
              description={room.description ?? "Premium karaoke experience."}
              roomType={room.roomType}
              status={room.status}
              capacity={room.capacity}
              pricePerHour={room.pricePerHour}
              imagePath={room.images[0] ?? null}
            />
          ))
        )}
      </section>
    </div>
  );
}
