import prisma from "@/app/lib/db";
import { NoItems } from "@/app/components/NoItem";
import { unstable_noStore as noStore } from "next/cache";

async function getServices() {
  noStore();
  return prisma.service.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="container mx-auto px-5 py-8 lg:px-10">
      <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <h1 className="text-4xl font-semibold text-white">Service catalogue</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Manage drinks, snacks, fruits, and combo packages for karaoke bookings.
        </p>
      </div>

      {services.length === 0 ? (
        <NoItems title="No services configured" description="Add services through the manager API or seed data." />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">{service.name}</h2>
                <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-fuchsia-200">
                  {service.category}
                </span>
              </div>
              <p className="mt-4 text-slate-400">{service.description}</p>
              <p className="mt-6 text-2xl font-semibold text-white">${service.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
