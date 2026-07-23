import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto").max(60),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["STUDENT", "TUTOR"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const bookingSchema = z
  .object({
    tutorProfileId: z.string().min(1),
    subjectName: z.string().min(1),
    date: z.string().min(1),
    durationMin: z.union([
      z.literal(45),
      z.literal(60),
      z.literal(75),
      z.literal(90),
      z.literal(105),
      z.literal(120),
    ]),
    modality: z.enum(["ONSITE", "VIRTUAL"]),
    location: z.string().max(200).optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((data) => data.modality !== "ONSITE" || (data.location ?? "").trim().length > 0, {
    message: "Ingresa la ubicación de la clase presencial",
    path: ["location"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;

export const tutorProfileSchema = z.object({
  headline: z.string().min(5).max(120),
  bio: z.string().min(20).max(2000),
  yearsExp: z.number().int().min(0).max(60),
  city: z.string().max(80).optional(),
  online: z.boolean(),
  subjects: z.array(z.string()).min(1, "Elige al menos una materia"),
  photoUrl: z
    .string()
    .max(2_000_000, "La imagen es demasiado pesada")
    .regex(/^data:image\//, "Formato de imagen inválido")
    .optional()
    .or(z.literal("")),
});

export type TutorProfileInput = z.infer<typeof tutorProfileSchema>;

export const meetLinkSchema = z.object({
  meetLink: z
    .string()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/meet\.google\.com\//.test(v), {
      message: "Ingresa un link válido de Google Meet",
    }),
});
