import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SUBJECTS = [
  { name: "Matemática", emoji: "➗" },
  { name: "Física", emoji: "🪐" },
  { name: "Química", emoji: "🧪" },
  { name: "Inglés", emoji: "🇬🇧" },
  { name: "Hebreo", emoji: "🇮🇱" },
  { name: "Historia", emoji: "📜" },
  { name: "Biología", emoji: "🧬" },
];

async function main() {
  console.log("Sembrando materias...");
  for (const s of SUBJECTS) {
    await prisma.subject.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  console.log("Sembrando cuenta de administrador...");
  const adminPasswordHash = await bcrypt.hash("PenPaper2026!", 10);
  await prisma.user.upsert({
    where: { email: "aaronbreziner@gmail.com" },
    update: { isAdmin: true },
    create: {
      name: "Aaron Breziner",
      email: "aaronbreziner@gmail.com",
      passwordHash: adminPasswordHash,
      role: "STUDENT",
      isAdmin: true,
    },
  });

  console.log("Listo!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
