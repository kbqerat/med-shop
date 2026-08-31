import { StarIcon } from "@/components/icons";
import { getTranslations } from "@/lib/i18n/server";

/** First letter of the first and last name parts — works for Arabic and Latin. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = [...(parts[0] ?? "")][0] ?? "";
  const last = parts.length > 1 ? ([...parts[parts.length - 1]][0] ?? "") : "";
  return first + last || "★";
}

/** Deterministic avatar gradient so each reviewer keeps the same colour. */
function avatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(135deg, hsl(${hue} 55% 52%), hsl(${(hue + 40) % 360} 55% 38%))`;
}

export async function Testimonials() {
  const { messages, t } = await getTranslations();
  const tt = messages.testimonials;
  const items = tt.items;
  const avg = items.reduce((sum, x) => sum + x.rating, 0) / items.length;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 px-6 py-14 sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -start-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -end-24 -bottom-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {tt.kicker}
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {tt.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-5 py-3 ring-1 ring-white/10 backdrop-blur">
              <span className="text-4xl font-bold leading-none text-white">
                {avg.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(avg) ? "text-accent" : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-white/55">
                  {t(tt.reviewsLabel, { count: items.length })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <figure
                key={item.name}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.1] hover:ring-white/25"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute end-4 top-1 select-none font-serif text-7xl leading-none text-white/10 transition-colors duration-300 group-hover:text-accent/30"
                >
                  &ldquo;
                </span>

                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < item.rating ? "text-accent" : "text-white/15"
                      }`}
                    />
                  ))}
                </div>

                {/* dir="auto" so Latin-script (Darija) reviews read left-to-right
                    even inside the RTL Arabic layout. */}
                <blockquote
                  dir="auto"
                  className="relative mt-4 flex-1 text-sm leading-relaxed text-white/85"
                >
                  {item.quote}
                </blockquote>

                <figcaption dir="auto" className="mt-6 flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-sm font-bold text-white ring-1 ring-white/15"
                    style={{ backgroundImage: avatarGradient(item.name) }}
                  >
                    {initials(item.name)}
                  </span>
                  <span className="min-w-0 text-sm leading-tight">
                    <span className="block truncate font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="block truncate text-white/50">{item.city}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
