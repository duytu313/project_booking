import Image from "next/image";
import Link from "next/link";

type RoomCardProps = {
  roomId: string;
  name: string;
  description: string;
  roomType: string;
  status: string;
  capacity: number;
  pricePerHour: number;
  imagePath?: string | null;
};

export function RoomCard({
  roomId,
  name,
  description,
  roomType,
  status,
  capacity,
  pricePerHour,
  imagePath,
}: RoomCardProps) {
  const imageSrc = imagePath
    ? imagePath
    : "https://images.unsplash.com/photo-1541807084-5c52b6b6cfe5?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/80 shadow-2xl shadow-slate-900/20 transition hover:-translate-y-1">
      <div className="relative h-72 w-full overflow-hidden bg-slate-900">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
            {roomType}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${status === "AVAILABLE" ? "bg-slate-900/80 text-emerald-300" : status === "USING" ? "bg-rose-900/80 text-rose-300" : "bg-amber-900/80 text-amber-300"}`}>
            {status}
          </span>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <p className="mt-1 text-sm text-slate-400 line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="rounded-full border border-slate-800/70 px-3 py-1">Capacity {capacity}</span>
          <span className="rounded-full border border-slate-800/70 px-3 py-1">${pricePerHour}/hr</span>
        </div>

        <Link href={`/rooms/${roomId}`} className="inline-flex w-full items-center justify-center rounded-2xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-500">
          View room
        </Link>
      </div>
    </div>
  );
}
