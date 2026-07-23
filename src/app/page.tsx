import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTutorCards } from "@/lib/tutors";
import TutorCard from "@/components/TutorCard";
import { MIN_SESSION_PRICE } from "@/lib/pricing";

const STEPS = [
  {
    emoji: "🔎",
    title: "Busca tu tutor",
    text: "Filtra por materia y encuentra el match perfecto.",
  },
  {
    emoji: "📅",
    title: "Agenda una clase",
    text: "Elige día, horario y materia. Recibes confirmación al instante.",
  },
  {
    emoji: "📲",
    title: "Coordina el pago",
    text: `Escríbenos por WhatsApp con el total (desde $${MIN_SESSION_PRICE}) y listo.`,
  },
];

export default async function Home() {
  const [subjects, featuredTutors] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    getTutorCards(),
  ]);

  return (
    <div>
      <section className="paper-lines border-b-[3px] border-black px-5 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <Image
            src="/logo.png"
            alt="Pen & Paper"
            width={110}
            height={110}
            className="rounded-full border-[3px] border-black bg-white"
          />
          <span className="btn-pop-sm rounded-full bg-white px-4 py-1 text-sm font-semibold text-ink">
            ¡Más de {featuredTutors.length} tutores esperándote! 👋
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
            Agenda ya
            <br /> tu tutoría ✏️
          </h1>
          <p className="max-w-xl text-lg text-ink/80">
            Clases particulares de matemática, idiomas, hebreo y mucho más.
            Desde <strong>${MIN_SESSION_PRICE}</strong> la clase, sin sorpresas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/tutores"
              className="btn-pop rounded-full bg-primary px-6 py-3 font-display font-semibold text-white"
            >
              Buscar un tutor
            </Link>
            <Link
              href="/registro"
              className="btn-pop rounded-full bg-white px-6 py-3 font-display font-semibold text-ink"
            >
              Quiero ser tutor
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center font-display text-3xl font-bold text-ink">¿Cómo funciona?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="card-shadow flex flex-col items-center gap-2 rounded-2xl bg-white p-6 text-center"
            >
              <span className="text-4xl">{step.emoji}</span>
              <p className="font-display text-lg font-bold text-primary-dark">
                {i + 1}. {step.title}
              </p>
              <p className="text-sm text-ink/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-tan px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-bold text-ink">Materias populares</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {subjects.map((s) => (
              <Link
                key={s.id}
                href={`/tutores?materia=${encodeURIComponent(s.name)}`}
                className="card-shadow rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink/80 transition-transform hover:-translate-y-1 hover:text-primary-dark"
              >
                <span className="mr-1.5">{s.emoji}</span>
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-ink">Tutores destacados</h2>
          <Link href="/tutores" className="font-semibold text-secondary-dark hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTutors.slice(0, 6).map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="card-shadow mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-3xl bg-secondary px-8 py-12 text-center text-white">
          <h2 className="font-display text-3xl font-bold">¿Eres bueno enseñando?</h2>
          <p className="max-w-md text-white/90">
            Únete como tutor, elige tus horarios y empieza a dar clases a tu manera. En cada
            clase te quedas con el 80% y Pen &amp; Paper se queda con el 20%.
          </p>
          <Link
            href="/registro"
            className="btn-pop rounded-full bg-white px-6 py-3 font-display font-semibold text-secondary-dark"
          >
            Convertirme en tutor
          </Link>
        </div>
      </section>
    </div>
  );
}
