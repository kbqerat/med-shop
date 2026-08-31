"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteStoredFile, isStoredUrl } from "@/lib/storage";
import { slugify } from "@/lib/slugify";

export type ProductFormState = { error: string } | undefined;

const ACCENT_PALETTE: [string, string][] = [
  ["#e8d4a0", "#b8895a"],
  ["#eaf1fb", "#7fa8d9"],
  ["#dbe4fb", "#3d4f99"],
  ["#f5d6d6", "#b95c5c"],
  ["#e2f5e2", "#5a8a5a"],
  ["#fbe7d4", "#d98c3f"],
  ["#f0e6fb", "#8a5ab8"],
  ["#e6f7f5", "#3f9e94"],
];

function randomAccent(): { accentFrom: string; accentTo: string } {
  const [accentFrom, accentTo] =
    ACCENT_PALETTE[Math.floor(Math.random() * ACCENT_PALETTE.length)];
  return { accentFrom, accentTo };
}

/**
 * Media is uploaded straight to R2 by the browser; the form only submits the
 * resulting public URLs. Keep the ones we actually own and ignore the rest.
 */
function parseMedia(formData: FormData): { imageUrls: string[]; videoUrl: string | null } {
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("imageUrls") || "[]"));
  } catch {
    raw = [];
  }
  const imageUrls = Array.isArray(raw) ? raw.filter((u): u is string => isStoredUrl(u)) : [];

  const video = String(formData.get("videoUrl") || "").trim();
  const videoUrl = isStoredUrl(video) ? video : null;

  return { imageUrls, videoUrl };
}

type ParsedVariant = { size: string; stock: number };

type ParsedFields =
  | { ok: true; data: {
      name: string;
      description: string;
      priceCents: number;
      categoryId: string;
      archived: boolean;
      variants: ParsedVariant[];
    } }
  | { ok: false; error: string };

function parseFields(formData: FormData): ParsedFields {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const priceDh = Number(formData.get("price"));
  const archived = formData.get("archived") === "on";

  if (!name || !description || !categoryId) {
    return { ok: false, error: "Veuillez remplir tous les champs obligatoires." };
  }
  if (!Number.isFinite(priceDh) || priceDh <= 0) {
    return { ok: false, error: "Saisissez un prix valide." };
  }

  let rawVariants: unknown;
  try {
    rawVariants = JSON.parse(String(formData.get("variants") || "[]"));
  } catch {
    return { ok: false, error: "Impossible de lire les tailles." };
  }
  if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
    return { ok: false, error: "Ajoutez au moins une taille." };
  }

  const variants: ParsedVariant[] = [];
  const seen = new Set<string>();
  for (const raw of rawVariants) {
    const row = raw as Record<string, unknown>;
    const size = String(row.size ?? "").trim();
    const stock = Number(row.stock);
    if (!size) {
      return { ok: false, error: "Chaque ligne de taille doit avoir un nom." };
    }
    if (seen.has(size.toLowerCase())) {
      return { ok: false, error: `Taille en double : ${size}` };
    }
    seen.add(size.toLowerCase());
    if (!Number.isInteger(stock) || stock < 0) {
      return { ok: false, error: `Saisissez une quantité de stock valide pour ${size}.` };
    }
    variants.push({ size, stock });
  }

  return {
    ok: true,
    data: {
      name,
      description,
      categoryId,
      priceCents: Math.round(priceDh * 100),
      archived,
      variants,
    },
  };
}

function revalidateStorefront() {
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = parseFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return { error: "Sélectionnez une catégorie valide." };

  const slug = slugify(parsed.data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Un produit portant ce nom existe déjà." };
  }

  const { imageUrls, videoUrl } = parseMedia(formData);
  const { variants, ...productData } = parsed.data;

  await prisma.product.create({
    data: {
      ...productData,
      slug,
      imageUrl: imageUrls[0] ?? null,
      videoUrl,
      ...randomAccent(),
      images: { create: imageUrls.map((url, position) => ({ url, position })) },
      variants: {
        create: variants.map((variant, position) => ({
          size: variant.size,
          stock: variant.stock,
          position,
        })),
      },
    },
  });

  revalidateStorefront();
  redirect("/admin/products");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!product) return { error: "Produit introuvable." };

  const parsed = parseFields(formData);
  if (!parsed.ok) return { error: parsed.error };

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return { error: "Sélectionnez une catégorie valide." };

  const removedIds = new Set(formData.getAll("removeImageIds").map(String));
  const keptImages = product.images.filter((img) => !removedIds.has(img.id));
  const removedImages = product.images.filter((img) => removedIds.has(img.id));

  const { imageUrls: newUrls, videoUrl } = parseMedia(formData);

  const imageUrl = keptImages[0]?.url ?? newUrls[0] ?? null;
  const staleVideoUrl =
    product.videoUrl && product.videoUrl !== videoUrl ? product.videoUrl : null;
  const { variants, ...productData } = parsed.data;

  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { id: { in: [...removedIds] } } }),
    ...keptImages.map((img, position) =>
      prisma.productImage.update({ where: { id: img.id }, data: { position } })
    ),
    prisma.productVariant.deleteMany({
      where: { productId, size: { notIn: variants.map((v) => v.size) } },
    }),
    ...variants.map((variant, position) =>
      prisma.productVariant.upsert({
        where: { productId_size: { productId, size: variant.size } },
        create: {
          productId,
          size: variant.size,
          stock: variant.stock,
          position,
        },
        update: { stock: variant.stock, position },
      })
    ),
    prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
        imageUrl,
        videoUrl,
        images: {
          create: newUrls.map((url, i) => ({ url, position: keptImages.length + i })),
        },
      },
    }),
  ]);

  await Promise.all([
    ...removedImages.map((img) => deleteStoredFile(img.url)),
    ...(staleVideoUrl ? [deleteStoredFile(staleVideoUrl)] : []),
  ]);

  revalidateStorefront();
  revalidatePath(`/products/${product.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") || "");
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!product) redirect("/admin/products");

  const orderItemCount = await prisma.orderItem.count({ where: { productId } });
  if (orderItemCount > 0) {
    redirect(
      `/admin/products?error=${encodeURIComponent(
        `« ${product.name} » a des commandes existantes et ne peut pas être supprimé.`
      )}`
    );
  }

  await prisma.product.delete({ where: { id: productId } });
  const fileUrls = new Set(product.images.map((img) => img.url));
  if (product.imageUrl) fileUrls.add(product.imageUrl);
  if (product.videoUrl) fileUrls.add(product.videoUrl);
  await Promise.all([...fileUrls].map((url) => deleteStoredFile(url)));

  revalidateStorefront();
  redirect("/admin/products");
}

export async function toggleProductArchived(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const product = await prisma.product.findUnique({
    where: { id },
    select: { archived: true, slug: true },
  });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { archived: !product.archived },
  });

  revalidateStorefront();
  revalidatePath(`/products/${product.slug}`);
}
