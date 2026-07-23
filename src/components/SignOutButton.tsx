import { signOut } from "@/auth";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-full px-4 py-2 text-sm font-semibold text-ink/70 hover:text-secondary-dark transition-colors cursor-pointer"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
