import Link from "next/link";
import Avatar from "@/components/Avatar";
import StarRating from "@/components/StarRating";
import type { TutorCard as TutorCardType } from "@/lib/tutors";
import { MIN_SESSION_PRICE } from "@/lib/pricing";

export default function TutorCard({ tutor }: { tutor: TutorCardType }) {
  return (
    <Link
      href={`/tutores/${tutor.id}`}
      className="card-shadow flex flex-col gap-3 rounded-2xl bg-white p-5 transition-transform hover:-translate-y-1"
    >
      <div className="flex items-center gap-3">
        <Avatar name={tutor.name} color={tutor.avatarColor} photoUrl={tutor.photoUrl} size={44} />
        <div>
          <p className="font-display font-semibold leading-tight">{tutor.name}</p>
          <StarRating rating={tutor.avgRating} count={tutor.ratingCount} />
        </div>
      </div>

      <p className="text-sm font-medium text-ink/80">{tutor.headline}</p>

      <div className="flex flex-wrap gap-1.5">
        {tutor.subjects.map((s) => (
          <span
            key={s.id}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-dark"
          >
            {s.emoji} {s.name}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 text-sm">
        <span className="text-ink/50">
          {tutor.city ?? "Remoto"} · {tutor.yearsExp} años de exp.
        </span>
        <span className="font-display font-bold text-secondary-dark">
          Desde ${MIN_SESSION_PRICE}
        </span>
      </div>
    </Link>
  );
}
