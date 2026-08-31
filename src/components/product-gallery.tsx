"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { useI18n } from "@/context/i18n";

type Slide = { type: "video" | "image"; src: string };

export function ProductGallery({
  images,
  video,
  accentFrom,
  accentTo,
  className = "",
}: {
  images: string[];
  video?: string | null;
  accentFrom: string;
  accentTo: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const { messages, t } = useI18n();

  // The video, when present, always leads the slider.
  const slides: Slide[] = [
    ...(video ? [{ type: "video" as const, src: video }] : []),
    ...images.map((src) => ({ type: "image" as const, src })),
  ];

  if (slides.length === 0) {
    return (
      <ProductArt
        accentFrom={accentFrom}
        accentTo={accentTo}
        imageUrl={null}
        className={className}
      />
    );
  }

  const hasMultiple = slides.length > 1;
  const current = slides[Math.min(active, slides.length - 1)];

  function go(delta: number) {
    setActive((prev) => (prev + delta + slides.length) % slides.length);
  }

  return (
    <div className="min-w-0">
      <div
        className={`group relative overflow-hidden bg-surface ${className}`}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
          setTouchStartX(null);
        }}
      >
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={current.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
            priority
          />
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={messages.product.prevPhoto}
              className="absolute start-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 focus-visible:opacity-100 rtl:-scale-x-100"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={messages.product.nextPhoto}
              className="absolute end-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 focus-visible:opacity-100 rtl:-scale-x-100"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 end-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              {t(messages.product.photoCount, {
                current: active + 1,
                total: slides.length,
              })}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={
                slide.type === "video"
                  ? messages.product.showVideo
                  : t(messages.product.showPhoto, { n: i + 1 })
              }
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface ring-2 transition-colors ${
                i === active ? "ring-accent" : "ring-transparent hover:ring-surface-border"
              }`}
            >
              {slide.type === "video" ? (
                <>
                  <video
                    src={slide.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-white drop-shadow"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </>
              ) : (
                <Image src={slide.src} alt="" fill sizes="64px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
