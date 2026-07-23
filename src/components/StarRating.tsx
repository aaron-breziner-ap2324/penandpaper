export default function StarRating({
  rating,
  count,
}: {
  rating: number | null;
  count: number;
}) {
  if (rating === null || count === 0) {
    return <span className="text-xs text-ink/50">Sin reseñas todavía</span>;
  }

  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-sm">
      <span aria-hidden className="text-accent">
        {"★".repeat(rounded)}
        {"☆".repeat(5 - rounded)}
      </span>
      <span className="text-ink/60">
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}
