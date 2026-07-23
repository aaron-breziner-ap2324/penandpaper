import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";
import BookingForm from "@/components/BookingForm";
import { MIN_SESSION_PRICE } from "@/lib/pricing";

export default async function ReservarPage({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) {
  const { tutorId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");
  if (session.user.role !== "STUDENT") redirect("/panel");

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: { user: true, subjectLinks: { include: { subject: true } } },
  });

  if (!tutorProfile || !tutorProfile.approved) notFound();

  const subjects = tutorProfile.subjectLinks.map((sl) => sl.subject);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <Link
        href={`/tutores/${tutorProfile.id}`}
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Volver al perfil
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <Avatar
          name={tutorProfile.user.name}
          color={tutorProfile.user.avatarColor}
          photoUrl={tutorProfile.photoUrl}
          size={48}
        />
        <div>
          <h1 className="font-display text-2xl font-bold">
            Reservar clase con {tutorProfile.user.name}
          </h1>
          <p className="text-sm text-ink/60">Desde ${MIN_SESSION_PRICE} según duración</p>
        </div>
      </div>

      <div className="card-shadow mt-6 rounded-3xl bg-white p-8">
        {subjects.length === 0 ? (
          <p className="text-ink/60">Este tutor todavía no cargó materias.</p>
        ) : (
          <BookingForm
            tutorProfileId={tutorProfile.id}
            tutorName={tutorProfile.user.name}
            subjects={subjects}
          />
        )}
      </div>
    </div>
  );
}
