import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { tutorProfile: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  const isAdmin = session.user.isAdmin;
  const isTutor = booking.tutorProfile.userId === session.user.id;
  const isStudent = booking.studentId === session.user.id;
  if (!isTutor && !isStudent && !isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Solo Aaron confirma una clase (una vez recibido el pago)
  if (parsed.data.status === "CONFIRMED" && !isAdmin) {
    return NextResponse.json(
      { error: "Solo se confirma la clase una vez recibido el pago" },
      { status: 403 }
    );
  }

  // El tutor o el admin marcan una clase como completada
  if (parsed.data.status === "COMPLETED" && !isTutor && !isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json(updated);
}
