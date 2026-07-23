"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TutorApprovalActions({ tutorProfileId }: { tutorProfileId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function approve() {
    setLoading("approve");
    await fetch(`/api/admin/tutors/${tutorProfileId}`, { method: "PATCH" });
    setLoading(null);
    router.refresh();
  }

  async function reject() {
    setLoading("reject");
    await fetch(`/api/admin/tutors/${tutorProfileId}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={approve}
        disabled={loading !== null}
        className="btn-pop-sm rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        {loading === "approve" ? "..." : "Aprobar"}
      </button>
      <button
        onClick={reject}
        disabled={loading !== null}
        className="btn-pop-sm rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink disabled:opacity-50"
      >
        {loading === "reject" ? "..." : "Rechazar"}
      </button>
    </div>
  );
}
