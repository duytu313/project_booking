type BookingCardProps = {
  id: string;
  roomName: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  status: string;
  customerName?: string;
};

function formatTime(dateIso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateIso));
}

export function BookingCard({
  id,
  roomName,
  startTime,
  endTime,
  totalHours,
  totalPrice,
  status,
  customerName,
}: BookingCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5 shadow-lg shadow-slate-900/30">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Booking ID</p>
          <p className="mt-1 font-semibold text-white">{id}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${status === "COMPLETED" ? "bg-emerald-600/15 text-emerald-300" : status === "ACTIVE" ? "bg-fuchsia-600/15 text-fuchsia-300" : status === "CANCELLED" ? "bg-rose-600/15 text-rose-300" : "bg-slate-700 text-slate-200"}`}>
          {status}
        </span>
      </div>

      <div className="mt-5 space-y-4 text-slate-300">
        <div>
          <p className="text-sm text-slate-400">Room</p>
          <p className="font-semibold text-white">{roomName}</p>
        </div>
        {customerName ? (
          <div>
            <p className="text-sm text-slate-400">Customer</p>
            <p className="font-semibold text-white">{customerName}</p>
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">Starts</p>
            <p className="mt-1 font-semibold text-white">{formatTime(startTime)}</p>
          </div>
          <div className="rounded-2xl bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">Ends</p>
            <p className="mt-1 font-semibold text-white">{formatTime(endTime)}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">Duration</p>
            <p className="mt-1 font-semibold text-white">{totalHours.toFixed(1)} hrs</p>
          </div>
          <div className="rounded-2xl bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">Total Price</p>
            <p className="mt-1 font-semibold text-white">${totalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
