"use client";

import { DownloadIcon } from "@/components/icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
    >
      <DownloadIcon className="h-4 w-4" />
      Imprimer / Enregistrer en PDF
    </button>
  );
}
