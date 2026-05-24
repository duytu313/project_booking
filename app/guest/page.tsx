import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export default async function GuestPage() {
  noStore();
  const currentUser = await getCurrentUser();
  const role = currentUser?.dbUser?.role;

  if (role === "ADMIN" || role === "MANAGER") {
    redirect("/dashboard");
  }

  const name = currentUser?.kindeUser?.given_name ?? "Guest";

  return (
    <main className="container mx-auto px-5 py-12 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">KTV Guest Experience</p>
          <h1 className="text-5xl font-semibold text-white leading-tight sm:text-6xl">
            Sing louder, book smarter, and manage every stay with ease.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            Discover premium karaoke rooms, reserve by the hour, and keep your group in the groove.
            Guests can browse rooms, book a session, and review their reservations from one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/rooms" className="inline-flex items-center justify-center rounded-3xl bg-fuchsia-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300">
              Browse rooms
            </Link>
            {currentUser ? (
              <Link href="/bookings" className="inline-flex items-center justify-center rounded-3xl border border-slate-800/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                My bookings
              </Link>
            ) : (
              <Link href="/api/auth/login" className="inline-flex items-center justify-center rounded-3xl border border-slate-800/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Login to book
              </Link>
            )}
          </div>
        </section>

        <aside className="space-y-6 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <div className="rounded-3xl bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Welcome back</p>
            <p className="mt-3 text-2xl font-semibold text-white">{name}</p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Best rooms</p>
              <p className="mt-2 text-xl font-semibold text-white">VIP, Luxury & Standard</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Easy booking</p>
              <p className="mt-2 text-xl font-semibold text-white">Hour-based reservations</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Service add-ons</p>
              <p className="mt-2 text-xl font-semibold text-white">Drinks, snacks, party sets</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
