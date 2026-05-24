"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type StatusCounts = {
  AVAILABLE: number;
  USING: number;
  CLEANING: number;
  MAINTENANCE: number;
};

export function RealtimeRoomUpdates({ initialCounts }: { initialCounts: StatusCounts }) {
  const [statusCounts, setStatusCounts] = useState<StatusCounts>(initialCounts);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-rooms")
      .on("postgres_changes", { event: "*", schema: "public", table: "KaraokeRoom" }, (payload) => {
        const newRow = payload.new as { status: string } | null;
        const oldRow = payload.old as { status: string } | null;

        if (!newRow) {
          return;
        }

        setStatusCounts((prev) => {
          const updated = { ...prev };
          if (oldRow) {
            const oldStatus = oldRow.status as keyof StatusCounts;
            updated[oldStatus] = Math.max(0, updated[oldStatus] - 1);
          }

          const newStatus = newRow.status as keyof StatusCounts;
          updated[newStatus] = (updated[newStatus] || 0) + 1;

          return updated;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {Object.entries(statusCounts).map(([status, value]) => (
        <div key={status} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{status}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
