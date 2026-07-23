"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { resizeImageToDataUrl } from "@/lib/image";

type Subject = { id: string; name: string; emoji: string };

export default function TutorProfileForm({
  tutorName,
  subjects,
  initial,
}: {
  tutorName: string;
  subjects: Subject[];
  initial: {
    headline: string;
    bio: string;
    yearsExp: number;
    city: string;
    online: boolean;
    photoUrl: string | null;
    subjectIds: string[];
  };
}) {
  const router = useRouter();
  const [headline, setHeadline] = useState(initial.headline);
  const [bio, setBio] = useState(initial.bio);
  const [yearsExp, setYearsExp] = useState(initial.yearsExp);
  const [city, setCity] = useState(initial.city);
  const [online, setOnline] = useState(initial.online);
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl ?? "");
  const [subjectIds, setSubjectIds] = useState<string[]>(initial.subjectIds);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  function toggleSubject(id: string) {
    setSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setPhotoUrl(dataUrl);
    } catch {
      setError("No pudimos procesar esa imagen. Prueba con otra foto.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);

    const res = await fetch("/api/tutor-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline,
        bio,
        yearsExp,
        city,
        online,
        photoUrl,
        subjects: subjectIds,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No pudimos guardar los cambios");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-medium text-secondary-dark">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-xl bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
          ¡Perfil actualizado! ✅
        </p>
      )}

      <div className="flex items-center gap-4">
        <Avatar name={tutorName} photoUrl={photoUrl} size={72} />
        <label className="btn-pop-sm cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">
          {uploadingPhoto ? "Procesando..." : "Subir foto"}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Título llamativo
        <input
          required
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
          placeholder="Ej: Profe de Matemática con 8 años de experiencia"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Sobre mí
        <textarea
          required
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
          placeholder="Cuéntales a tus alumnos cómo das clases, tu experiencia, etc."
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Años de experiencia
        <input
          type="number"
          min={0}
          required
          value={yearsExp}
          onChange={(e) => setYearsExp(Number(e.target.value))}
          className="w-full rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary sm:w-40"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Ciudad (o &quot;Remoto&quot;)
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={online}
          onChange={(e) => setOnline(e.target.checked)}
          className="h-4 w-4 accent-[color:var(--color-primary)]"
        />
        Doy clases online
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">Materias que enseño</p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => toggleSubject(s.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                subjectIds.includes(s.id)
                  ? "bg-primary text-white"
                  : "bg-cream text-ink/70 hover:bg-primary/10"
              }`}
            >
              {s.emoji} {s.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-pop mt-2 rounded-full bg-primary px-6 py-3 font-display font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
