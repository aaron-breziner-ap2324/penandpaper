import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16">
      <span className="text-4xl">🎉</span>
      <h1 className="mt-3 font-display text-3xl font-bold">Únete a la red</h1>
      <p className="mt-1 text-center text-ink/60">
        Crea tu cuenta gratis como alumno o como tutor.
      </p>

      <div className="card-shadow mt-8 w-full rounded-3xl bg-white p-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-sm text-ink/60">
        ¿Ya tienes cuenta?{" "}
        <Link href="/iniciar-sesion" className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
