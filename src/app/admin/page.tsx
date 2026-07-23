import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";
import BookingActions from "@/components/BookingActions";
import TutorApprovalActions from "@/components/TutorApprovalActions";
import BookingModalityInfo from "@/components/BookingModalityInfo";
import MeetLinkForm from "@/components/MeetLinkForm";
import { platformFee, tutorPayout } from "@/lib/pricing";

const dateFmt = new Intl.DateTimeFormat("es-PA", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");
  if (!session.user.isAdmin) redirect("/panel");

  const [pendingTutors, pendingBookings, confirmedBookings] = await Promise.all([
    prisma.tutorProfile.findMany({
      where: { approved: false },
      include: { user: true, subjectLinks: { include: { subject: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.booking.findMany({
      where: { status: "PENDING" },
      include: { student: true, tutorProfile: { include: { user: true } } },
      orderBy: { date: "asc" },
    }),
    prisma.booking.findMany({
      where: { status: "CONFIRMED" },
      include: { student: true, tutorProfile: { include: { user: true } } },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold">Panel de administración 🛠️</h1>
      <p className="mt-1 text-ink/60">
        Aquí apruebas tutores nuevos y confirmas las clases una vez que te llega el pago.
      </p>

      <div className="card-shadow mt-6 rounded-2xl bg-tan p-4 text-sm text-ink/80">
        💻 Para ver o editar la base de datos completa, corre{" "}
        <code className="rounded bg-white px-1.5 py-0.5">npx prisma studio</code> desde el
        proyecto.
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold">
        Tutores pendientes de aprobación {pendingTutors.length > 0 && `(${pendingTutors.length})`}
      </h2>
      {pendingTutors.length === 0 ? (
        <p className="mt-3 text-ink/60">No hay tutores esperando aprobación.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {pendingTutors.map((t) => (
            <div
              key={t.id}
              className="card-shadow flex flex-col gap-3 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar name={t.user.name} color={t.user.avatarColor} photoUrl={t.photoUrl} size={44} />
                <div>
                  <p className="font-semibold">{t.user.name}</p>
                  <p className="text-sm text-ink/60">{t.headline}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {t.subjectLinks.map((sl) => (
                      <span
                        key={sl.id}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-dark"
                      >
                        {sl.subject.emoji} {sl.subject.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <TutorApprovalActions tutorProfileId={t.id} />
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-2xl font-bold">
        Clases pendientes de pago {pendingBookings.length > 0 && `(${pendingBookings.length})`}
      </h2>
      {pendingBookings.length === 0 ? (
        <p className="mt-3 text-ink/60">No hay clases esperando confirmación de pago.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {pendingBookings.map((b) => (
            <div
              key={b.id}
              className="card-shadow flex flex-col gap-2 rounded-2xl bg-white p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex-1">
                <p className="font-semibold">
                  {b.subjectName} · {b.student.name} con {b.tutorProfile.user.name}
                </p>
                <p className="text-sm text-ink/60">
                  {dateFmt.format(b.date)} · {b.durationMin} min · ${b.price} (te quedas con $
                  {platformFee(b.price)}, tutor recibe ${tutorPayout(b.price)})
                </p>
                <div className="mt-1">
                  <BookingModalityInfo
                    modality={b.modality}
                    location={b.location}
                    meetLink={b.meetLink}
                  />
                </div>
                {b.modality === "VIRTUAL" && (
                  <MeetLinkForm bookingId={b.id} initialLink={b.meetLink} />
                )}
              </div>
              <BookingActions
                bookingId={b.id}
                actions={[
                  { label: "Confirmar pago", status: "CONFIRMED", tone: "primary" },
                  { label: "Cancelar", status: "CANCELLED", tone: "danger" },
                ]}
              />
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-2xl font-bold">
        Clases confirmadas próximas {confirmedBookings.length > 0 && `(${confirmedBookings.length})`}
      </h2>
      {confirmedBookings.length === 0 ? (
        <p className="mt-3 text-ink/60">No hay clases confirmadas por ahora.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {confirmedBookings.map((b) => (
            <div key={b.id} className="card-shadow rounded-2xl bg-white p-5">
              <p className="font-semibold">
                {b.subjectName} · {b.student.name} con {b.tutorProfile.user.name}
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
              {b.modality === "VIRTUAL" && (
                <MeetLinkForm bookingId={b.id} initialLink={b.meetLink} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
