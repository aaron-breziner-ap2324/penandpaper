"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MeetLinkForm({
  bookingId,
  initialLink,
}: {
  bookingId: string;
  initialLink: string | null;
}) {
  const router = useRouter();
  const [meetLink, setMeetLink] = useState(initialLink ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/bookings/${bookingId}/meet-link`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetLink }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No pudimos guardar el link");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-center gap-2">
      <input
        value={meetLink}
        onChange={(e) => setMeetLink(e.target.value)}
        placeholder="https://meet.google.com/xxx-xxxx-xxx"
        className="min-w-[220px] flex-1 rounded-lg border-2 border-black px-3 py-1.5 text-xs outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-pop-sm rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        {loading ? "..." : "Guardar link"}
      </button>
      {error && <p className="w-full text-xs font-medium text-primary-dark">{error}</p>}
    </form>
  );
}
