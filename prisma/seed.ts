import { PrismaClient } from "@prisma/client";

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
