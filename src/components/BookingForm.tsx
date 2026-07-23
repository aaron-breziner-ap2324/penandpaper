"use client";

import { useState } from "react";
import Link from "next/link";
import { buildBookingWhatsAppLink } from "@/lib/whatsapp";
import { DURATION_PRICES, priceForDuration } from "@/lib/pricing";

type Subject = { id: string; name: string; emoji: string };
type Modality = "ONSITE" | "VIRTUAL";

export default function BookingForm({
  tutorProfileId,
  tutorName,
  subjects,
}: {
  tutorProfileId: string;
  tutorName: string;
  subjects: Subject[];
}) {
  const [subjectName, setSubjectName] = useState(subjects[0]?.name ?? "");
  const [date, setDate] = useState("");
  const [durationMin, setDurationMin] = useState<number>(DURATION_PRICES[1].minutes);
  const [modality, setModality] = useState<Modality>("VIRTUAL");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const price = priceForDuration(durationMin);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorProfileId,
        subjectName,
        date: new Date(date).toISOString(),
        durationMin,
        modality,
        location: modality === "ONSITE" ? location : undefined,
        notes: notes || undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No pudimos crear la reserva");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    const whatsappLink = buildBookingWhatsAppLink({
      tutorName,
      subjectName,
      date: new Date(date),
      durationMin,
      price,
      modality,
      location,
    });

    return (
      <div className="card-shadow rounded-2xl bg-white p-6 text-center">
        <p className="text-4xl">🎉</p>
        <p className="mt-2 font-display font-bold text-ink">¡Reserva enviada!</p>
        <p className="mt-1 text-sm text-ink/70">
          Último paso: escríbenos por WhatsApp con el total de la clase (${price}) para
          coordinar el pago. Aaron confirma la clase apenas recibe el pago
          {modality === "VIRTUAL" ? " y te comparte el link de Google Meet." : "."}
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pop mt-5 inline-block rounded-full bg-[#25D366] px-6 py-3 font-display font-semibold text-white"
        >
          📲 Escribir por WhatsApp
        </a>
        <div className="mt-4">
          <Link href="/panel" className="text-sm font-semibold text-secondary-dark hover:underline">
            Ir a mis clases →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-medium text-secondary-dark">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Materia
        <select
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.name}>
              {s.emoji} {s.name}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="mb-1.5 text-sm font-medium">Modalidad</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setModality("VIRTUAL")}
            className={`rounded-xl border-2 border-black p-3 text-center font-semibold transition-colors ${
              modality === "VIRTUAL" ? "bg-primary/15 text-primary-dark" : "bg-white text-ink/60"
            }`}
          >
            🎥
            <br />
            Virtual (Meet)
          </button>
          <button
            type="button"
            onClick={() => setModality("ONSITE")}
            className={`rounded-xl border-2 border-black p-3 text-center font-semibold transition-colors ${
              modality === "ONSITE" ? "bg-primary/15 text-primary-dark" : "bg-white text-ink/60"
            }`}
          >
            📍
            <br />
            Presencial
          </button>
        </div>
      </div>

      {modality === "ONSITE" ? (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Ubicación de la clase
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
            placeholder="Ej: Mi casa, Calle 50, Ciudad de Panamá"
          />
        </label>
      ) : (
        <p className="rounded-xl bg-secondary/10 px-4 py-2.5 text-sm text-secondary-dark">
          🎥 Aaron te va a compartir el link de Google Meet cuando confirme el pago.
        </p>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Fecha y hora
        <input
          type="datetime-local"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Duración
        <select
          value={durationMin}
          onChange={(e) => setDurationMin(Number(e.target.value))}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
        >
          {DURATION_PRICES.map((d) => (
            <option key={d.minutes} value={d.minutes}>
              {d.label} — ${d.price}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Notas para el tutor (opcional)
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
          placeholder="Ej: quiero repasar derivadas antes del examen"
        />
      </label>

      <div className="rounded-xl bg-tan px-4 py-3 text-sm text-ink/80">
        💵 Esta clase cuesta <strong>${price}</strong>. Al confirmar, te vamos a pedir que
        escribas por WhatsApp con el total para coordinar el pago.
      </div>

      <button
        type="submit"
        disabled={loading || !date || (modality === "ONSITE" && !location.trim())}
        className="btn-pop mt-2 rounded-full bg-primary px-6 py-3 font-display font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Reservando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
