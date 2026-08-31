"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useI18n } from "@/context/i18n";
import { isRtl } from "@/lib/i18n/config";

const VISIBLE_DESKTOP = 4;

export function SimilarProductsCarousel({ products }: { products: ProductCardData[] }) {
  const infinite = products.length > VISIBLE_DESKTOP;

  if (!infinite) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    );
  }

  return <InfiniteCarousel products={products} />;
}

function InfiniteCarousel({ products }: { products: ProductCardData[] }) {
  const cloneCount = Math.min(VISIBLE_DESKTOP, products.length);
  const extended = [
    ...products.slice(-cloneCount),
    ...products,
    ...products.slice(0, cloneCount),
  ];

  const { messages, locale } = useI18n();
  const rtl = isRtl(locale);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(cloneCount);
  const [step, setStep] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function measure() {
      const first = trackRef.current?.children[0] as HTMLElement | undefined;
      if (!first) return;
      // Slide pitch as a positive magnitude — works the same in LTR and RTL.
      setStep(first.getBoundingClientRect().width);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [withTransition]);

  function go(delta: number) {
    setIndex((prev) => prev + delta);
  }

  function handleTransitionEnd() {
    if (index >= products.length + cloneCount) {
      setWithTransition(false);
      setIndex((prev) => prev - products.length);
    } else if (index < cloneCount) {
      setWithTransition(false);
      setIndex((prev) => prev + products.length);
    }
  }

  // LTR track advances by translating left (negative X); RTL by translating right.
  const offset = (rtl ? 1 : -1) * index * step;

  return (
    <div className="group/carousel relative">
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 40) {
              const dir = delta > 0 ? -1 : 1;
              go(rtl ? -dir : dir);
            }
            touchStartX.current = null;
          }}
          className="flex"
          style={{
            transform: `translateX(${offset}px)`,
            transition: withTransition ? "transform 400ms ease" : "none",
          }}
        >
          {extended.map((product, i) => (
            <div
              key={`${product.slug}-${i}`}
              className="min-w-0 flex-shrink-0 basis-1/2 px-2 sm:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={messages.product.prevProducts}
        className="absolute -start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-lg ring-1 ring-surface-border transition-transform hover:scale-105 rtl:-scale-x-100"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={messages.product.nextProducts}
        className="absolute -end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-lg ring-1 ring-surface-border transition-transform hover:scale-105 rtl:-scale-x-100"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
