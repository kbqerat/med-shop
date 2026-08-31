import Image from "next/image";

export function ProductArt({
  accentFrom = "#e5e5e5",
  accentTo = "#a3a3a3",
  imageUrl,
  className = "",
}: {
  accentFrom?: string;
  accentTo?: string;
  imageUrl?: string | null;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 55%)",
        }}
      />
      <svg
        viewBox="0 0 64 64"
        className="h-1/2 w-1/2 text-black/25 drop-shadow-sm"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M32 8c-13.3 0-24 9.6-24 24v2h48v-2c0-13.3-10.7-23.7-24-24z" />
        <path d="M8 34c0 3.3 2.7 6 6 6h4v-6H8z" />
        <rect x="28" y="4" width="8" height="6" rx="2" />
      </svg>
    </div>
  );
}
