"use client";

import { useState } from "react";
import { GlobeIcon } from "@/components/icons";
import { useI18n } from "@/context/i18n";
import { LOCALES, type Locale } from "@/lib/i18n/config";

export function LanguageSwitch() {
  const { locale, messages, switchLocale } = useI18n();
  const [open, setOpen] = useState(false);

  const labels: Record<Locale, string> = {
    ar: messages.language.ar,
    fr: messages.language.fr,
    en: messages.language.en,
  };

  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={messages.language.switchLabel}
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
      >
        <GlobeIcon className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-1 min-w-[9rem] overflow-hidden rounded-xl border border-surface-border bg-background py-1 shadow-lg"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              onClick={() => switchLocale(l)}
              className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-start text-sm transition-colors hover:bg-surface ${
                l === locale ? "font-semibold text-foreground" : "text-muted"
              }`}
            >
              {labels[l]}
              {l === locale && <span className="text-accent">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
