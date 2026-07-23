import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TutorProfileForm from "@/components/TutorProfileForm";
import AvailabilityManager from "@/components/AvailabilityManager";

export default async function EditTutorProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");
  if (session.user.role !== "TUTOR") redirect("/panel");

  const [tutorProfile, subjects] = await Promise.all([
    prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subjectLinks: true, availability: true, user: true },
    }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!tutorProfile) redirect("/panel");

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold">Mi perfil de tutor ✏️</h1>
      <p className="mt-1 text-ink/60">
        Este es el perfil que ven los alumnos cuando buscan un tutor.
      </p>

      <div className="card-shadow mt-8 rounded-3xl bg-white p-8">
        <TutorProfileForm
          tutorName={tutorProfile.user.name}
          subjects={subjects}
          initial={{
            headline: tutorProfile.headline,
            bio: tutorProfile.bio,
            yearsExp: tutorProfile.yearsExp,
            city: tutorProfile.city ?? "",
            online: tutorProfile.online,
            photoUrl: tutorProfile.photoUrl,
            subjectIds: tutorProfile.subjectLinks.map((s) => s.subjectId),
          }}
        />
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold">Disponibilidad horaria</h2>
      <div className="card-shadow mt-4 rounded-3xl bg-white p-8">
        <AvailabilityManager slots={tutorProfile.availability} />
      </div>
    </div>
  );
}
