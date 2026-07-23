import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { tutorProfileSchema } from "@/lib/validation";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TUTOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = tutorProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { headline, bio, yearsExp, city, online, subjects, photoUrl } = parsed.data;

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!tutorProfile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: {
        headline,
        bio,
        yearsExp,
        city,
        online,
        ...(photoUrl ? { photoUrl } : {}),
      },
    }),
    prisma.tutorSubject.deleteMany({ where: { tutorProfileId: tutorProfile.id } }),
    prisma.tutorSubject.createMany({
      data: subjects.map((subjectId) => ({
        tutorProfileId: tutorProfile.id,
        subjectId,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
