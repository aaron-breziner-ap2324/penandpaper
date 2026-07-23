import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";
import SignOutButton from "@/components/SignOutButton";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-black bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
          <Image
            src="/logo.png"
            alt="Pen & Paper"
            width={44}
            height={44}
            className="rounded-full border-2 border-black"
          />
          <span>
            Pen <span className="text-primary">&amp;</span> Paper
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/80 sm:flex">
          <Link href="/" className="hover:text-secondary-dark transition-colors">
            Inicio
          </Link>
          <Link href="/tutores" className="hover:text-secondary-dark transition-colors">
            Encontrar tutores
          </Link>
          {user?.role === "TUTOR" && (
            <Link href="/panel" className="hover:text-secondary-dark transition-colors">
              Mi panel
            </Link>
          )}
          {user?.role === "STUDENT" && (
            <Link href="/panel" className="hover:text-secondary-dark transition-colors">
              Mis clases
            </Link>
          )}
          {session?.user?.isAdmin && (
            <Link href="/admin" className="hover:text-secondary-dark transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar name={user.name} color={user.avatarColor} size={32} />
                <span className="text-sm font-semibold">{user.name}</span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <>
              <Link
                href="/iniciar-sesion"
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink/80 hover:text-secondary-dark transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="btn-pop-sm rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
