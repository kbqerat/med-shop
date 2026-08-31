"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface p-8">
        <p className="text-xl font-bold tracking-tight">
          Med Shop
        </p>
        <h1 className="mt-4 text-lg font-bold">Connexion admin</h1>
        <p className="mt-1 text-sm text-muted">
          Saisissez le mot de passe administrateur pour continuer.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <input
            name="password"
            type="password"
            required
            autoFocus
            placeholder="Mot de passe"
            className="w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
          />

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50"
          >
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
