import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

const AVATAR_COLORS = ["#6C5CE7", "#FF7675", "#00B894", "#0984E3", "#FDCB6E", "#E17055", "#00CEC9"];

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese email" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      avatarColor,
      ...(role === "TUTOR"
        ? {
            tutorProfile: {
              create: {
                headline: "Nuevo tutor en la red",
                bio: "Todavía no completé mi biografía.",
                yearsExp: 0,
              },
            },
          }
        : {}),
    },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
