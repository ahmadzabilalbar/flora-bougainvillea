import Image from "next/image";
import { bractColors } from "@/lib/colors";

/** Variety image, or an illustrated bract placeholder tinted to the variety's colour. */
export function FlowerImage({
  src,
  alt,
  color = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  className = "",
}: {
  src?: string;
  alt: string;
  color?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  const [deep, light] = bractColors(color);
  const id = alt.replace(/\W/g, "") || "flower";
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={alt}
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor={light} stopOpacity="0.55" />
          <stop offset="100%" stopColor={light} stopOpacity="0.15" />
        </radialGradient>
        <linearGradient id={`b-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="#f7f3ee" />
      <rect width="200" height="200" fill={`url(#bg-${id})`} />
      {[
        [62, 70, 0.9, -20],
        [140, 64, 0.75, 25],
        [100, 128, 1.1, 0],
        [40, 150, 0.6, 15],
        [162, 150, 0.7, -10],
      ].map(([x, y, s, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          {[0, 120, 240].map((a) => (
            <path
              key={a}
              transform={`rotate(${a})`}
              d="M0 0 C -22 -10 -26 -42 0 -52 C 26 -42 22 -10 0 0 Z"
              fill={`url(#b-${id})`}
              opacity="0.92"
            />
          ))}
          <circle r="4" fill="#fef3c7" />
        </g>
      ))}
    </svg>
  );
}
