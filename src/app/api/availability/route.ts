import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TUTOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success || parsed.data.endHour <= parsed.data.startHour) {
    return NextResponse.json({ error: "Horario inválido" }, { status: 400 });
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!tutorProfile) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  const slot = await prisma.availability.create({
    data: { ...parsed.data, tutorProfileId: tutorProfile.id },
  });

  return NextResponse.json(slot);
}
