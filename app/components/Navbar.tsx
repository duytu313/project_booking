import Link from "next/link";
import { UserNav } from "./UserNav";
import { getCurrentUser } from "@/app/lib/auth";

export default async function Navbar() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.dbUser?.role;

  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-10">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
          KTV Control
        </Link>

        <div className="hidden items-center gap-6 md:flex text-sm font-medium text-slate-300">
          <Link href="/rooms" className="transition hover:text-white">
            Rooms
          </Link>
          <Link href="/bookings" className="transition hover:text-white">
            Bookings
          </Link>
          <Link href="/services" className="transition hover:text-white">
            Services
          </Link>
          {(role === "ADMIN" || role === "MANAGER") && (
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
          )}
        </div>

        <UserNav />
      </div>
    </nav>
  );
}
