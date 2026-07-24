import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { meetLinkSchema } from "@/lib/validation";
import { sendMeetLinkAddedEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = meetLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { tutorProfile: { include: { user: true } }, student: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  const isAdmin = Boolean(session.user.isAdmin);
  const isTutor = booking.tutorProfile.userId === session.user.id;
  if (!isAdmin && !isTutor) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  if (booking.modality !== "VIRTUAL") {
    return NextResponse.json({ error: "Esta clase no es virtual" }, { status: 400 });
  }

  // El tutor solo puede cargar el link una vez que Aaron confirmó el pago
  if (isTutor && !isAdmin && booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Todavía no se confirmó el pago de esta clase" },
      { status: 403 }
    );
  }

  const meetLink = parsed.data.meetLink || null;

  const updated = await prisma.booking.update({
    where: { id },
    data: { meetLink },
  });

  if (meetLink) {
    await sendMeetLinkAddedEmail({
      studentEmail: booking.student.email,
      studentName: booking.student.name,
      tutorName: booking.tutorProfile.user.name,
      subjectName: booking.subjectName,
      date: booking.date,
      meetLink,
    });
  }

  return NextResponse.json(updated);
}
