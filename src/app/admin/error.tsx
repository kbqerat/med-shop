"use client";

import { useEffect } from "react";
import Link from "next/link";

// Covers both /admin/login and the dashboard — it sits above (dashboard)/layout.tsx,
// so it renders without the sidebar (which may be what failed).
export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Une erreur est survenue</h1>
      <p className="max-w-md text-sm text-muted">
        Cette page d’administration n’a pas pu se charger. Réessayer suffit souvent.
      </p>
      {error.digest && (
        <p className="text-xs text-muted">Référence : {error.digest}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          Réessayer
        </button>
        <Link
          href="/admin/products"
          className="rounded-lg border border-surface-border px-6 py-2.5 text-sm font-semibold transition-colors hover:border-foreground"
        >
          Accueil admin
        </Link>
      </div>
    </div>
  );
}
