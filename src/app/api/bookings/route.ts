import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { priceForDuration } from "@/lib/pricing";
import { sendBookingCreatedEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Solo los alumnos pueden reservar clases" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { tutorProfileId, subjectName, date, durationMin, modality, location, notes } = parsed.data;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() < Date.now()) {
    return NextResponse.json({ error: "Elige una fecha futura válida" }, { status: 400 });
  }

  let price: number;
  try {
    price = priceForDuration(durationMin);
  } catch {
    return NextResponse.json({ error: "Duración inválida" }, { status: 400 });
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: { user: true },
  });
  if (!tutorProfile) {
    return NextResponse.json({ error: "Tutor no encontrado" }, { status: 404 });
  }
  if (!tutorProfile.approved) {
    return NextResponse.json(
      { error: "Este tutor todavía no fue aprobado" },
      { status: 403 }
    );
  }

  const student = await prisma.user.findUnique({ where: { id: session.user.id } });

  const booking = await prisma.booking.create({
    data: {
      studentId: session.user.id,
      tutorProfileId,
      subjectName,
      date: parsedDate,
      durationMin,
      price,
      modality,
      location: modality === "ONSITE" ? location : undefined,
      notes,
    },
  });

  if (student) {
    await sendBookingCreatedEmail({
      tutorEmail: tutorProfile.user.email,
      tutorName: tutorProfile.user.name,
      studentName: student.name,
      subjectName,
      date: parsedDate,
      durationMin,
      price,
    });
  }

  return NextResponse.json(booking);
}
