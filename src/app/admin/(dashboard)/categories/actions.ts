"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/slugify";
import { deleteStoredFile, isStoredUrl } from "@/lib/storage";

export type CategoryFormState = { error: string } | undefined;

function revalidateStorefront() {
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
}

/** The category image URL the browser uploaded to R2, or null. */
function readImageUrl(formData: FormData): string | null {
  const url = String(formData.get("imageUrl") || "").trim();
  return isStoredUrl(url) ? url : null;
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Saisissez un nom de catégorie." };

  const slug = slugify(name);
  if (!slug) return { error: "Saisissez un nom de catégorie valide." };

  const existing = await prisma.category.findFirst({
    where: { OR: [{ slug }, { name }] },
  });
  if (existing) return { error: "Une catégorie portant ce nom existe déjà." };

  await prisma.category.create({
    data: { name, slug, imageUrl: readImageUrl(formData) },
  });

  revalidateStorefront();
  redirect("/admin/categories");
}

export async function updateCategory(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return { error: "Catégorie introuvable." };

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Saisissez un nom de catégorie." };

  const existing = await prisma.category.findFirst({
    where: { name, NOT: { id: categoryId } },
  });
  if (existing) return { error: "Une catégorie portant ce nom existe déjà." };

  const imageUrl = readImageUrl(formData);

  await prisma.category.update({
    where: { id: categoryId },
    data: { name, imageUrl },
  });

  // Drop the old file once it's no longer referenced.
  if (category.imageUrl && category.imageUrl !== imageUrl) {
    await deleteStoredFile(category.imageUrl);
  }

  revalidateStorefront();
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") || "");
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) redirect("/admin/categories");

  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        `« ${category.name} » contient ${productCount} produit${productCount === 1 ? "" : "s"} — déplacez-les ou supprimez-les d’abord.`
      )}`
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
  await deleteStoredFile(category.imageUrl);

  revalidateStorefront();
  redirect("/admin/categories");
}
