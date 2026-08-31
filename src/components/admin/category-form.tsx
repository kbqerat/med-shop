"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { UploadIcon, TrashIcon } from "@/components/icons";
import { uploadToStorage } from "@/lib/upload-client";
import type { CategoryFormState } from "@/app/admin/(dashboard)/categories/actions";

export type CategoryFormInitialValues = {
  name: string;
  imageUrl?: string | null;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function CategoryForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (
    prevState: CategoryFormState,
    formData: FormData
  ) => Promise<CategoryFormState>;
  initialValues?: CategoryFormInitialValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [imageUrl, setImageUrl] = useState<string>(initialValues?.imageUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError("L’image dépasse 5 Mo.");
      return;
    }
    setBusy(true);
    try {
      setImageUrl(await uploadToStorage(file, "category-image"));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Échec du téléversement.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      action={formAction}
      className="mt-6 space-y-6 rounded-2xl border border-surface-border bg-surface p-6 sm:p-8"
    >
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div>
        <label className="text-sm font-semibold">Image</label>
        <p className="mt-1 text-xs text-muted">
          Photo affichée pour cette catégorie sur la boutique.
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-surface-border bg-background">
            {imageUrl ? (
              <Image src={imageUrl} alt="" fill sizes="96px" className="object-cover" />
            ) : (
              <UploadIcon className="h-6 w-6 text-muted" />
            )}
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                aria-label="Retirer l’image"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white shadow"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="min-w-0">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground"
            />
            <p className="mt-1 text-xs text-muted">
              JPG, PNG, WEBP ou GIF — 5 Mo max. Optionnel.
            </p>
          </div>
        </div>
        {busy && <p className="mt-2 text-sm text-muted">Téléversement en cours…</p>}
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold">Nom</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialValues?.name}
          placeholder="ex. Nike"
          className="mt-1.5 w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || busy}
        className="rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : busy ? "Téléversement…" : submitLabel}
      </button>
    </form>
  );
}
