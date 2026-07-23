"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No pudimos crear tu cuenta");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      router.push("/iniciar-sesion");
      return;
    }

    router.push(role === "TUTOR" ? "/panel/perfil" : "/panel");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-xl bg-secondary/10 px-4 py-2.5 text-sm font-medium text-secondary-dark">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("STUDENT")}
          className={`rounded-2xl border-2 p-4 text-center font-semibold transition-colors ${
            role === "STUDENT"
              ? "border-primary bg-primary/10 text-primary-dark"
              : "border-black/10 text-ink/60 hover:border-primary/40"
          }`}
        >
          🎒
          <br />
          Quiero aprender
        </button>
        <button
          type="button"
          onClick={() => setRole("TUTOR")}
          className={`rounded-2xl border-2 p-4 text-center font-semibold transition-colors ${
            role === "TUTOR"
              ? "border-primary bg-primary/10 text-primary-dark"
              : "border-black/10 text-ink/60 hover:border-primary/40"
          }`}
        >
          🍎
          <br />
          Quiero enseñar
        </button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Nombre
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
          placeholder="Tu nombre completo"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
          placeholder="tu@email.com"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Contraseña
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border-2 border-black px-4 py-2.5 outline-none focus:border-primary"
          placeholder="Al menos 6 caracteres"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="btn-pop mt-2 rounded-full bg-primary px-6 py-3 font-display font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
