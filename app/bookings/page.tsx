import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { NoItems } from "@/app/components/NoItem";
import { BookingCard } from "@/app/components/BookingCard";
import { unstable_noStore as noStore } from "next/cache";

async function getBookings(userId: string) {
  noStore();

  return prisma.booking.findMany({
    where: { customerId: userId },
    include: {
      room: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BookingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect("/rooms");
  }

  const bookings = await getBookings(user.id);

  return (
    <div className="container mx-auto px-5 py-8 lg:px-10">
      <div className="mb-8 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <h1 className="text-4xl font-semibold text-white">Your Bookings</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Review active and past karaoke room reservations, including hour totals and pricing.
        </p>
      </div>
      {bookings.length === 0 ? (
        <NoItems
          title="No bookings yet"
          description="Reserve a karaoke room and your bookings will appear here."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              id={booking.id}
              roomName={booking.room?.name ?? "Unknown Room"}
              startTime={booking.startTime.toISOString()}
              endTime={booking.endTime.toISOString()}
              totalHours={booking.totalHours}
              totalPrice={booking.totalPrice}
              status={booking.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
