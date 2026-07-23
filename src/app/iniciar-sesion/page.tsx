import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16">
      <span className="text-4xl">👋</span>
      <h1 className="mt-3 font-display text-3xl font-bold">¡Hola de nuevo!</h1>
      <p className="mt-1 text-center text-ink/60">Inicia sesión para seguir aprendiendo o enseñando.</p>

      <div className="card-shadow mt-8 w-full rounded-3xl bg-white p-8">
        <LoginForm />
      </div>

      <p className="mt-6 text-sm text-ink/60">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-primary hover:underline">
          Regístrate
        </Link>
      </p>

      <p className="mt-4 rounded-xl bg-accent/15 px-4 py-2 text-xs text-ink/60">
        Demo: prueba con <strong>camila@tutores.dev</strong> / <strong>tutor1234</strong>
      </p>
    </div>
  );
}
