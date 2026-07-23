export const AARON_WHATSAPP_NUMBER = "50767512164";

const dateFmt = new Intl.DateTimeFormat("es-PA", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function buildBookingWhatsAppLink(params: {
  tutorName: string;
  subjectName: string;
  date: Date;
  durationMin: number;
  price: number;
  modality: "ONSITE" | "VIRTUAL";
  location?: string;
}) {
  const { tutorName, subjectName, date, durationMin, price, modality, location } = params;

  const modalityLine =
    modality === "ONSITE"
      ? `📍 Modalidad: Presencial (${location})`
      : "🎥 Modalidad: Virtual (Google Meet)";

  const message = [
    "¡Hola Aaron! 👋 Quiero coordinar el pago de mi clase en Pen & Paper:",
    "",
    `📚 Tutor/a: ${tutorName}`,
    `📘 Materia: ${subjectName}`,
    `📅 Fecha: ${dateFmt.format(date)}`,
    `⏱️ Duración: ${durationMin} min`,
    modalityLine,
    `💵 Total a pagar: $${price}`,
    "",
    "¡Gracias!",
  ].join("\n");

  return `https://wa.me/${AARON_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
