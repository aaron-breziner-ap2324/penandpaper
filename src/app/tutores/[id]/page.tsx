import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getTutorProfileById } from "@/lib/tutors";
import Avatar from "@/components/Avatar";
import StarRating from "@/components/StarRating";
import { DURATION_PRICES } from "@/lib/pricing";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await getTutorProfileById(id);
  if (!tutor) notFound();

  const session = await auth();
  const isOwnProfile = session?.user?.id === tutor.userId;
  const isAdmin = Boolean(session?.user?.isAdmin);

  if (!tutor.approved && !isOwnProfile && !isAdmin) notFound();

  const canBook = session?.user && session.user.role === "STUDENT" && !isOwnProfile;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link href="/tutores" className="text-sm font-semibold text-primary hover:underline">
        ← Volver a la búsqueda
      </Link>

      {!tutor.approved && (isOwnProfile || isAdmin) && (
        <div className="card-shadow mt-4 rounded-2xl bg-accent/25 p-4 text-sm text-ink/80">
          ⏳ Este perfil todavía no fue aprobado por Aaron. No aparece en las búsquedas hasta
          que se apruebe.
        </div>
      )}

      <div className="card-shadow mt-4 rounded-3xl bg-white p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar name={tutor.name} color={tutor.avatarColor} photoUrl={tutor.photoUrl} size={80} />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold">{tutor.name}</h1>
            <p className="mt-1 text-lg text-ink/70">{tutor.headline}</p>
            <div className="mt-2">
              <StarRating rating={tutor.avgRating} count={tutor.ratingCount} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tutor.subjects.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-dark"
                >
                  {s.emoji} {s.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <p className="text-sm text-ink/60">
              {tutor.city ?? "Remoto"} · {tutor.yearsExp} años de experiencia
            </p>
            {canBook && (
              <Link
                href={`/reservar/${tutor.id}`}
                className="btn-pop-sm mt-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white"
              >
                Reservar clase
              </Link>
            )}
            {!session?.user && (
              <Link
                href="/iniciar-sesion"
                className="btn-pop-sm mt-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white"
              >
                Inicia sesión para reservar
              </Link>
            )}
            {isOwnProfile && (
              <Link
                href="/panel/perfil"
                className="btn-pop-sm mt-2 rounded-full bg-white px-6 py-2.5 text-center text-sm font-semibold text-ink"
              >
                Editar mi perfil
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-black/5 pt-6">
          <h2 className="font-display text-xl font-bold">Precio de las clases</h2>
          <div className="mt-3 overflow-hidden rounded-xl border-2 border-black">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-tan text-left">
                  <th className="px-4 py-2 font-semibold">Duración</th>
                  <th className="px-4 py-2 font-semibold">Costo</th>
                </tr>
              </thead>
              <tbody>
                {DURATION_PRICES.map((d, i) => (
                  <tr key={d.minutes} className={i % 2 === 1 ? "bg-cream" : "bg-white"}>
                    <td className="px-4 py-2">{d.label}</td>
                    <td className="px-4 py-2 font-semibold text-secondary-dark">${d.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 border-t border-black/5 pt-6">
          <h2 className="font-display text-xl font-bold">Sobre mí</h2>
          <p className="mt-2 whitespace-pre-line text-ink/80">{tutor.bio}</p>
        </div>

        {tutor.availability.length > 0 && (
          <div className="mt-8 border-t border-black/5 pt-6">
            <h2 className="font-display text-xl font-bold">Disponibilidad</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tutor.availability.map((a) => (
                <span
                  key={a.id}
                  className="rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success"
                >
                  {DAYS[a.dayOfWeek]} {a.startHour}:00–{a.endHour}:00
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-black/5 pt-6">
          <h2 className="font-display text-xl font-bold">
            Reseñas {tutor.ratingCount > 0 && `(${tutor.ratingCount})`}
          </h2>
          {tutor.reviews.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">Todavía no tiene reseñas.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {tutor.reviews.map((r) => (
                <div key={r.id} className="rounded-xl bg-cream p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{r.authorName}</p>
                    <span aria-hidden className="text-accent text-sm">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </span>
                  </div>
                  {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
