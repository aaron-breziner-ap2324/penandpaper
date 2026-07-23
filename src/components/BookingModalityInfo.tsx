export default function BookingModalityInfo({
  modality,
  location,
  meetLink,
}: {
  modality: "ONSITE" | "VIRTUAL";
  location?: string | null;
  meetLink?: string | null;
}) {
  if (modality === "ONSITE") {
    return <p className="text-sm text-ink/70">📍 {location ?? "Ubicación a confirmar"}</p>;
  }

  if (meetLink) {
    return (
      <a
        href={meetLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-secondary-dark hover:underline"
      >
        🎥 Unirse a Google Meet
      </a>
    );
  }

  return <p className="text-sm text-ink/50">🎥 Virtual — el link se comparte al confirmar el pago</p>;
}
