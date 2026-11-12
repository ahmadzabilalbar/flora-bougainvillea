import { FlowerImage } from "./flower-image";

type Shot = { label: string; src: string };

/** All three photos at once: whole plant large, flower and leaf close-ups side by side below. */
export function VarietyGallery({ name, color, shots }: { name: string; color: string; shots: Shot[] }) {
  const [main, ...details] = shots;
  return (
    <div className="space-y-4">
      <Photo shot={main} name={name} color={color} className="aspect-[4/5] rounded-[2.5rem]" priority sizes="(max-width: 1024px) 100vw, 50vw" />
      <div className="grid grid-cols-2 gap-4">
        {details.map((s) => (
          <Photo key={s.label} shot={s} name={name} color={color} className="aspect-square rounded-3xl" sizes="(max-width: 1024px) 50vw, 25vw" />
        ))}
      </div>
    </div>
  );
}

function Photo({
  shot,
  name,
  color,
  className,
  sizes,
  priority,
}: {
  shot: Shot;
  name: string;
  color: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure className={`relative overflow-hidden bg-white shadow-xl shadow-bract-900/10 ${className}`}>
      <FlowerImage src={shot.src} alt={`${name} — ${shot.label}`} color={color} priority={priority} sizes={sizes} />
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-leaf-900 backdrop-blur">
        {shot.label}
      </figcaption>
    </figure>
  );
}
