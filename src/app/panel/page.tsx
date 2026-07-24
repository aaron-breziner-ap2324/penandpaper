import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";
import StarRating from "@/components/StarRating";
import StatusBadge from "@/components/StatusBadge";
import BookingActions from "@/components/BookingActions";
import BookingModalityInfo from "@/components/BookingModalityInfo";
import MeetLinkForm from "@/components/MeetLinkForm";
import { buildBookingWhatsAppLink } from "@/lib/whatsapp";
import { tutorPayout } from "@/lib/pricing";

const dateFmt = new Intl.DateTimeFormat("es-PA", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function PanelPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/iniciar-sesion");

  if (user.role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
      include: {
        reviews: true,
        bookings: {
          include: { student: true },
          orderBy: { date: "desc" },
        },
      },
    });

    const ratingCount = tutorProfile?.reviews.length ?? 0;
    const avgRating =
      ratingCount > 0
        ? tutorProfile!.reviews.reduce((s, r) => s + r.rating, 0) / ratingCount
        : null;

    return (
      <div className="mx-auto max-w-4xl px-5 py-12">
        <div className="card-shadow flex flex-col gap-4 rounded-3xl bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={user.name}
              color={user.avatarColor}
              photoUrl={tutorProfile?.photoUrl}
              size={56}
            />
            <div>
              <h1 className="font-display text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-ink/60">{tutorProfile?.headline}</p>
              <StarRating rating={avgRating} count={ratingCount} />
            </div>
          </div>
          <Link
            href="/panel/perfil"
            className="btn-pop-sm rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Editar mi perfil
          </Link>
        </div>

        {tutorProfile && !tutorProfile.approved && (
          <div className="card-shadow mt-6 rounded-2xl bg-accent/25 p-4 text-sm text-ink/80">
            ⏳ Tu perfil todavía está pendiente de aprobación. Aaron lo va a revisar antes de
            que aparezcas en las búsquedas.
          </div>
        )}

        <div className="card-shadow mt-6 rounded-2xl bg-tan p-4 text-sm text-ink/80">
          💵 En cada clase, tú recibes el 80% y Pen &amp; Paper se queda con el 20%. El alumno
          coordina el pago directo con Aaron por WhatsApp, y Aaron confirma la clase apenas lo
          recibe.
        </div>

        <h2 className="mt-10 font-display text-2xl font-bold">Mis clases reservadas</h2>
        {!tutorProfile || tutorProfile.bookings.length === 0 ? (
          <p className="mt-3 text-ink/60">Todavía no tienes reservas. ¡Comparte tu perfil!</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {tutorProfile.bookings.map((b) => (
              <div
                key={b.id}
                className="card-shadow flex flex-col gap-2 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {b.subjectName} con {b.student.name}
                  </p>
                  <p className="text-sm text-ink/60">
                    {dateFmt.format(b.date)} · {b.durationMin} min · ${b.price} (ganas $
                    {tutorPayout(b.price)})
                  </p>
                  <div className="mt-1">
                    <BookingModalityInfo
                      modality={b.modality}
                      location={b.location}
                      meetLink={b.meetLink}
                    />
                  </div>
                  {b.status === "CONFIRMED" && b.modality === "VIRTUAL" && (
                    <MeetLinkForm bookingId={b.id} initialLink={b.meetLink} />
                  )}
                  {b.notes && <p className="mt-1 text-sm text-ink/50">&quot;{b.notes}&quot;</p>}
                  {b.status === "PENDING" && (
                    <p className="mt-1 text-xs text-ink/50">Esperando que Aaron confirme el pago</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />
                  {b.status === "PENDING" && (
                    <BookingActions
                      bookingId={b.id}
                      actions={[{ label: "Cancelar", status: "CANCELLED", tone: "danger" }]}
                    />
                  )}
                  {b.status === "CONFIRMED" && (
                    <BookingActions
                      bookingId={b.id}
                      actions={[{ label: "Marcar completada", status: "COMPLETED", tone: "primary" }]}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Alumno
  const bookings = await prisma.booking.findMany({
    where: { studentId: user.id },
    include: { tutorProfile: { include: { user: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="card-shadow flex items-center gap-4 rounded-3xl bg-white p-6">
        <Avatar name={user.name} color={user.avatarColor} size={56} />
        <div>
          <h1 className="font-display text-2xl font-bold">¡Hola, {user.name}! 👋</h1>
          <p className="text-sm text-ink/60">Aquí vas a ver todas tus clases reservadas.</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/tutores"
          className="btn-pop-sm rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Buscar más tutores
        </Link>
      </div>

      <h2 className="mt-6 font-display text-2xl font-bold">Mis clases</h2>
      {bookings.length === 0 ? (
        <div className="card-shadow mt-4 rounded-2xl bg-white p-10 text-center">
          <p className="text-4xl">📚</p>
          <p className="mt-3 font-display font-bold">Todavía no reservaste ninguna clase</p>
          <Link href="/tutores" className="mt-2 inline-block font-semibold text-primary hover:underline">
            Buscar un tutor →
          </Link>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {bookings.map((b) => {
            const whatsappLink = buildBookingWhatsAppLink({
              tutorName: b.tutorProfile.user.name,
              subjectName: b.subjectName,
              date: b.date,
              durationMin: b.durationMin,
              price: b.price,
              modality: b.modality,
              location: b.location ?? undefined,
            });

            return (
              <div
                key={b.id}
                className="card-shadow flex flex-col gap-3 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    name={b.tutorProfile.user.name}
                    color={b.tutorProfile.user.avatarColor}
                    photoUrl={b.tutorProfile.photoUrl}
                    size={40}
                  />
                  <div>
                    <p className="font-semibold">
                      {b.subjectName} con {b.tutorProfile.user.name}
                    </p>
                    <p className="text-sm text-ink/60">
                      {dateFmt.format(b.date)} · {b.durationMin} min · ${b.price}
                    </p>
                    <div className="mt-1">
                      <BookingModalityInfo
                        modality={b.modality}
                        location={b.location}
                        meetLink={b.meetLink}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={b.status} />
                  {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                    <>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pop-sm rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-semibold text-white"
                      >
                        📲 WhatsApp
                      </a>
                      <BookingActions
                        bookingId={b.id}
                        actions={[{ label: "Cancelar", status: "CANCELLED", tone: "danger" }]}
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
