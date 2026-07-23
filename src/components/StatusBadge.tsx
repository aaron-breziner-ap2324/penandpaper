const STYLES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-accent/25 text-ink/80" },
  CONFIRMED: { label: "Confirmada", className: "bg-secondary/20 text-secondary-dark" },
  CANCELLED: { label: "Cancelada", className: "bg-primary/15 text-primary-dark" },
  COMPLETED: { label: "Completada", className: "bg-brown/15 text-brown" },
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? STYLES.PENDING;
  return (
    <span
      className={`rounded-full border-2 border-black px-3 py-1 text-xs font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  );
}
