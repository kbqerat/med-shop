"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SIZE_OPTIONS } from "@/lib/product-filters";
import { UploadIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { uploadToStorage } from "@/lib/upload-client";
import type { ProductFormState } from "@/app/admin/(dashboard)/products/actions";

export type ProductFormInitialValues = {
  name: string;
  categoryId: string;
  priceDh: number;
  description: string;
  archived?: boolean;
  variants: { size: string; stock: number }[];
  images?: { id: string; url: string }[];
  videoUrl?: string | null;
};

type VariantRow = { size: string; stock: string };

const BLANK_VARIANT: VariantRow = { size: "", stock: "0" };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export function ProductForm({
  action,
  categories,
  initialValues,
  submitLabel,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: { id: string; name: string }[];
  initialValues?: ProductFormInitialValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [variants, setVariants] = useState<VariantRow[]>(
    initialValues?.variants?.length
      ? initialValues.variants.map((v) => ({
          size: v.size,
          stock: String(v.stock),
        }))
      : [{ ...BLANK_VARIANT }]
  );

  const existingImages = initialValues?.images ?? [];
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  // R2 URLs of photos uploaded during this session (appended, never replaced).
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>(initialValues?.videoUrl ?? "");
  const [busy, setBusy] = useState(0); // in-flight uploads
  const [uploadError, setUploadError] = useState<string | null>(null);

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setVariants((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }
  function addVariant() {
    setVariants((prev) => [...prev, { ...BLANK_VARIANT }]);
  }
  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;
    setUploadError(null);

    for (const file of picked) {
      if (file.size > MAX_IMAGE_BYTES) {
        setUploadError(`« ${file.name} » dépasse 5 Mo.`);
        continue;
      }
      setBusy((n) => n + 1);
      try {
        const url = await uploadToStorage(file, "product-image");
        setNewImageUrls((prev) => [...prev, url]);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Échec du téléversement.");
      } finally {
        setBusy((n) => n - 1);
      }
    }
  }

  function removeNewImage(index: number) {
    setNewImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    if (file.size > MAX_VIDEO_BYTES) {
      setUploadError("La vidéo dépasse 50 Mo.");
      return;
    }
    setBusy((n) => n + 1);
    try {
      const url = await uploadToStorage(file, "product-video");
      setVideoUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Échec du téléversement.");
    } finally {
      setBusy((n) => n - 1);
    }
  }

  const uploading = busy > 0;

  return (
    <form action={formAction} className="mt-6 space-y-6 rounded-2xl border border-surface-border bg-surface p-6 sm:p-8">
      <input type="hidden" name="imageUrls" value={JSON.stringify(newImageUrls)} />
      <input type="hidden" name="videoUrl" value={videoUrl} />
      {removedIds.map((id) => (
        <input key={id} type="hidden" name="removeImageIds" value={id} />
      ))}

      <div>
        <label className="text-sm font-semibold">Photos</label>
        <p className="mt-1 text-xs text-muted">
          La première photo sert d’image de couverture. Ajoutez-en plusieurs pour
          afficher un carrousel sur la page produit.
        </p>

        {(existingImages.length > 0 || newImageUrls.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-3">
            {existingImages.map((image) => {
              const removed = removedIds.includes(image.id);
              return (
                <div key={image.id} className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={image.url}
                    alt=""
                    width={96}
                    height={96}
                    className={`h-full w-full rounded-xl border border-surface-border object-cover ${
                      removed ? "opacity-30" : ""
                    }`}
                  />
                  {removed ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRemovedIds((prev) => prev.filter((id) => id !== image.id))
                      }
                      className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 text-xs font-semibold text-white"
                    >
                      Annuler
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRemovedIds((prev) => [...prev, image.id])}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white shadow"
                      aria-label="Supprimer la photo"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
            {newImageUrls.map((url, i) => (
              <div key={url} className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={url}
                  alt=""
                  width={96}
                  height={96}
                  className="h-full w-full rounded-xl border border-surface-border object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white shadow"
                  aria-label="Retirer la photo"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-4">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-surface-border bg-background">
            <UploadIcon className="h-6 w-6 text-muted" />
          </div>
          <div>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImagesChange}
              className="block text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground"
            />
            <p className="mt-1 text-xs text-muted">JPG, PNG, WEBP ou GIF — 5 Mo max chacune.</p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Vidéo (optionnel)</label>
        <p className="mt-1 text-xs text-muted">
          Une seule vidéo par produit. Elle s’affiche en premier dans le
          carrousel, avant les photos. MP4 ou WEBM — 50 Mo max.
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleVideoChange}
            className="block text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground"
          />
          {videoUrl && (
            <div className="relative w-48 flex-shrink-0">
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full rounded-xl border border-surface-border"
              />
              <button
                type="button"
                onClick={() => setVideoUrl("")}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white shadow"
                aria-label="Retirer la vidéo"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {uploading && <p className="text-sm text-muted">Téléversement en cours…</p>}
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <div>
        <label className="text-sm font-semibold">Nom</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialValues?.name}
          className="mt-1.5 w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Catégorie</label>
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <PlusIcon className="h-3 w-3" />
            Nouvelle catégorie
          </Link>
        </div>
        <select
          name="categoryId"
          required
          defaultValue={initialValues?.categoryId ?? ""}
          className="mt-1.5 w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        >
          <option value="" disabled>
            Sélectionnez une catégorie
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Prix (dh)</label>
        <input
          name="price"
          type="number"
          min={1}
          step={1}
          required
          defaultValue={initialValues?.priceDh}
          className="mt-1.5 w-full max-w-[12rem] rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Tailles et stock</label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <PlusIcon className="h-3 w-3" />
            Ajouter une taille
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">
          Une ligne par taille. Utilisez &laquo;&nbsp;Standard&nbsp;&raquo; pour
          les casquettes sans tailles. Chaque taille suit son propre stock.
        </p>

        <div className="mt-3 space-y-2">
          <div className="hidden gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted sm:grid sm:grid-cols-[minmax(0,1fr)_6rem_2rem]">
            <span>Taille</span>
            <span>Stock</span>
            <span />
          </div>
          {variants.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,1fr)_4.5rem_2rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_6rem_2rem]"
            >
              <input
                type="text"
                value={row.size}
                onChange={(e) => updateVariant(index, { size: e.target.value })}
                list="admin-sizes"
                autoComplete="off"
                placeholder="Taille"
                className="w-full min-w-0 rounded-lg border border-surface-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                type="number"
                min={0}
                step={1}
                value={row.stock}
                onChange={(e) => updateVariant(index, { stock: e.target.value })}
                className="w-full min-w-0 rounded-lg border border-surface-border bg-background px-2 py-2 text-sm outline-none focus:border-accent sm:px-3"
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={variants.length <= 1}
                aria-label="Supprimer la taille"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <datalist id="admin-sizes">
          {SIZE_OPTIONS.map((size) => (
            <option key={size.value} value={size.value} />
          ))}
        </datalist>
        <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      </div>

      <div>
        <label className="text-sm font-semibold">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initialValues?.description}
          className="mt-1.5 w-full rounded-lg border border-surface-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-surface-border bg-background p-4">
        <input
          type="checkbox"
          name="archived"
          defaultChecked={initialValues?.archived}
          className="mt-0.5 h-4 w-4 rounded border-surface-border accent-accent"
        />
        <span className="text-sm">
          <span className="font-semibold">Archivé</span>
          <span className="block text-xs text-muted">
            Masqué du magasin et de la recherche. Conserve l’historique des
            commandes — utilisez cette option plutôt que de supprimer un produit
            ayant des ventes.
          </span>
        </span>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || uploading}
        className="rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : uploading ? "Téléversement…" : submitLabel}
      </button>
    </form>
  );
}
