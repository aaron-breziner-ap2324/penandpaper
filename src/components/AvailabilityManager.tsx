"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

type Slot = { id: string; dayOfWeek: number; startHour: number; endHour: number };

export default function AvailabilityManager({ slots }: { slots: Slot[] }) {
  const router = useRouter();
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(11);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function addSlot(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayOfWeek, startHour, endHour }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No pudimos agregar el horario");
      return;
    }

    router.refresh();
  }

  async function removeSlot(id: string) {
    await fetch(`/api/availability/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-medium text-secondary-dark">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {slots.length === 0 && (
          <p className="text-sm text-ink/60">Todavía no cargaste horarios disponibles.</p>
        )}
        {slots.map((s) => (
          <span
            key={s.id}
            className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success"
          >
            {DAYS[s.dayOfWeek]} {s.startHour}:00–{s.endHour}:00
            <button
              type="button"
              onClick={() => removeSlot(s.id)}
              className="text-success/60 hover:text-secondary-dark"
              aria-label="Eliminar horario"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <form onSubmit={addSlot} className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium">
          Día
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
            className="rounded-lg border-2 border-black px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {DAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          Desde
          <input
            type="number"
            min={0}
            max={23}
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            className="w-20 rounded-lg border-2 border-black px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          Hasta
          <input
            type="number"
            min={1}
            max={24}
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className="w-20 rounded-lg border-2 border-black px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn-pop-sm rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Agregando..." : "+ Agregar horario"}
        </button>
      </form>
    </div>
  );
}
