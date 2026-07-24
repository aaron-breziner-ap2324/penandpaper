import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = "Pen & Paper <onboarding@resend.dev>";

const dateFmt = new Intl.DateTimeFormat("es-PA", {
  dateStyle: "medium",
  timeStyle: "short",
});

async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY no configurada, se omite el envío: "${params.subject}" -> ${params.to}`
    );
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (err) {
    console.error("[email] Error enviando email:", err);
  }
}

function wrapper(title: string, bodyHtml: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background:#FFF8E7; color:#241A10;">
      <h1 style="font-size:20px; margin-bottom: 8px;">${title}</h1>
      ${bodyHtml}
      <p style="margin-top:24px; color:#888; font-size:12px;">Pen &amp; Paper — Red de Tutores</p>
    </div>
  `;
}

export async function sendBookingCreatedEmail(params: {
  tutorEmail: string;
  tutorName: string;
  studentName: string;
  subjectName: string;
  date: Date;
  durationMin: number;
  price: number;
}) {
  const { tutorEmail, tutorName, studentName, subjectName, date, durationMin, price } = params;
  await sendEmail({
    to: tutorEmail,
    subject: `Nueva solicitud de clase de ${studentName}`,
    html: wrapper(
      `¡Hola ${tutorName}! 👋`,
      `<p><strong>${studentName}</strong> solicitó una clase de <strong>${subjectName}</strong>.</p>
       <p>📅 ${dateFmt.format(date)}<br/>⏱️ ${durationMin} min · 💵 $${price}</p>
       <p>Va a coordinar el pago por WhatsApp con Aaron. Te avisamos apenas se confirme.</p>`
    ),
  });
}

export async function sendBookingConfirmedEmail(params: {
  toEmail: string;
  toName: string;
  otherName: string;
  subjectName: string;
  date: Date;
  modality: "ONSITE" | "VIRTUAL";
  location?: string | null;
  meetLink?: string | null;
}) {
  const { toEmail, toName, otherName, subjectName, date, modality, location, meetLink } = params;

  const modalityHtml =
    modality === "ONSITE"
      ? `<p>📍 Ubicación: ${location ?? "a confirmar"}</p>`
      : meetLink
        ? `<p>🎥 <a href="${meetLink}">Unirse a Google Meet</a></p>`
        : `<p>🎥 Es una clase virtual — el link de Google Meet se comparte antes de la clase.</p>`;

  await sendEmail({
    to: toEmail,
    subject: `¡Tu clase de ${subjectName} fue confirmada! ✅`,
    html: wrapper(
      `¡Hola ${toName}! 👋`,
      `<p>Tu clase de <strong>${subjectName}</strong> con <strong>${otherName}</strong> fue confirmada.</p>
       <p>📅 ${dateFmt.format(date)}</p>
       ${modalityHtml}`
    ),
  });
}

export async function sendBookingCancelledEmail(params: {
  toEmail: string;
  toName: string;
  otherName: string;
  subjectName: string;
  date: Date;
}) {
  const { toEmail, toName, otherName, subjectName, date } = params;
  await sendEmail({
    to: toEmail,
    subject: `Clase de ${subjectName} cancelada`,
    html: wrapper(
      `Hola ${toName},`,
      `<p>La clase de <strong>${subjectName}</strong> con <strong>${otherName}</strong> del ${dateFmt.format(date)} fue cancelada.</p>`
    ),
  });
}

export async function sendMeetLinkAddedEmail(params: {
  studentEmail: string;
  studentName: string;
  tutorName: string;
  subjectName: string;
  date: Date;
  meetLink: string;
}) {
  const { studentEmail, studentName, tutorName, subjectName, date, meetLink } = params;
  await sendEmail({
    to: studentEmail,
    subject: `Link de tu clase de ${subjectName} 🎥`,
    html: wrapper(
      `¡Hola ${studentName}!`,
      `<p>Ya está listo el link para tu clase de <strong>${subjectName}</strong> con <strong>${tutorName}</strong>.</p>
       <p>📅 ${dateFmt.format(date)}</p>
       <p>🎥 <a href="${meetLink}">${meetLink}</a></p>`
    ),
  });
}
