import { prisma } from "@/lib/prisma";

export async function getTutorCards(opts?: { subject?: string; query?: string }) {
  const tutors = await prisma.tutorProfile.findMany({
    where: {
      approved: true,
      ...(opts?.subject
        ? { subjectLinks: { some: { subject: { name: opts.subject } } } }
        : {}),
      ...(opts?.query
        ? {
            OR: [
              { headline: { contains: opts.query } },
              { bio: { contains: opts.query } },
              { user: { name: { contains: opts.query } } },
            ],
          }
        : {}),
    },
    include: {
      user: true,
      subjectLinks: { include: { subject: true } },
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return tutors.map(toTutorCard);
}

export async function getTutorProfileById(id: string) {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      subjectLinks: { include: { subject: true } },
      reviews: { include: { author: true }, orderBy: { createdAt: "desc" } },
      availability: true,
    },
  });
  if (!tutor) return null;
  return {
    ...toTutorCard(tutor),
    reviews: tutor.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      authorName: r.author.name,
      createdAt: r.createdAt,
    })),
    availability: tutor.availability,
  };
}

function toTutorCard<
  T extends {
    id: string;
    headline: string;
    bio: string;
    photoUrl: string | null;
    yearsExp: number;
    city: string | null;
    online: boolean;
    approved: boolean;
    user: { id: string; name: string; avatarColor: string };
    subjectLinks: { subject: { id: string; name: string; emoji: string } }[];
    reviews: { rating: number }[];
  },
>(tutor: T) {
  const ratingCount = tutor.reviews.length;
  const avgRating =
    ratingCount > 0
      ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
      : null;

  return {
    id: tutor.id,
    userId: tutor.user.id,
    name: tutor.user.name,
    avatarColor: tutor.user.avatarColor,
    photoUrl: tutor.photoUrl,
    headline: tutor.headline,
    bio: tutor.bio,
    yearsExp: tutor.yearsExp,
    city: tutor.city,
    online: tutor.online,
    approved: tutor.approved,
    subjects: tutor.subjectLinks.map((sl) => sl.subject),
    avgRating,
    ratingCount,
  };
}

export type TutorCard = Awaited<ReturnType<typeof getTutorCards>>[number];
