import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTutorCards } from "@/lib/tutors";
import TutorCard from "@/components/TutorCard";

export default async function TutoresPage({
  searchParams,
}: {
  searchParams: Promise<{ materia?: string; q?: string }>;
}) {
  const { materia, q } = await searchParams;

  const [subjects, tutors] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    getTutorCards({ subject: materia, query: q }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-bold">Encuentra tu tutor 🔎</h1>
      <p className="mt-2 text-ink/70">
        {tutors.length} tutor{tutors.length === 1 ? "" : "es"} disponible
        {tutors.length === 1 ? "" : "s"}
        {materia ? ` en ${materia}` : ""}
      </p>

      <form className="mt-6 flex flex-wrap gap-3" action="/tutores">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre o palabra clave..."
          className="min-w-[240px] flex-1 rounded-full border-2 border-black bg-white px-5 py-2.5 text-sm outline-none focus:border-primary"
        />
        {materia && <input type="hidden" name="materia" value={materia} />}
        <button
          type="submit"
          className="btn-pop-sm rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white"
        >
          Buscar
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={q ? `/tutores?q=${encodeURIComponent(q)}` : "/tutores"}
          className={`rounded-full border-2 border-black px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !materia ? "bg-primary text-white" : "bg-white text-ink/70 hover:bg-primary/10"
          }`}
        >
          Todas
        </Link>
        {subjects.map((s) => {
          const params = new URLSearchParams();
          params.set("materia", s.name);
          if (q) params.set("q", q);
          return (
            <Link
              key={s.id}
              href={`/tutores?${params.toString()}`}
              className={`rounded-full border-2 border-black px-3.5 py-1.5 text-sm font-medium transition-colors ${
                materia === s.name
                  ? "bg-primary text-white"
                  : "bg-white text-ink/70 hover:bg-primary/10"
              }`}
            >
              {s.emoji} {s.name}
            </Link>
          );
        })}
      </div>

      {tutors.length === 0 ? (
        <div className="card-shadow mt-10 rounded-2xl bg-white p-10 text-center">
          <p className="text-4xl">🤷</p>
          <p className="mt-3 font-display font-bold">No encontramos tutores con ese filtro</p>
          <p className="mt-1 text-sm text-ink/60">Prueba con otra materia o búsqueda.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
}
