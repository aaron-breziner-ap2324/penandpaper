"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "CONFIRMED" | "CANCELLED" | "COMPLETED";

export default function BookingActions({
  bookingId,
  actions,
}: {
  bookingId: string;
  actions: { label: string; status: Status; tone: "primary" | "danger" }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<Status | null>(null);

  async function updateStatus(status: Status) {
    setLoading(status);
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {actions.map((a) => (
        <button
          key={a.status}
          onClick={() => updateStatus(a.status)}
          disabled={loading !== null}
          className={`btn-pop-sm rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-50 ${
            a.tone === "primary" ? "bg-primary text-white" : "bg-white text-primary-dark"
          }`}
        >
          {loading === a.status ? "..." : a.label}
        </button>
      ))}
    </div>
  );
}
