export default function Avatar({
  name,
  color = "#6C5CE7",
  size = 36,
  photoUrl,
}: {
  name: string;
  color?: string;
  size?: number;
  photoUrl?: string | null;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className="shrink-0 rounded-full border-2 border-black object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-black font-display font-semibold text-white shrink-0"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.45 }}
    >
      {initial}
    </div>
  );
}
