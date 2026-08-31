import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { position: "asc" } },
    },
  });
  if (!product) notFound();

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm font-medium text-muted hover:text-foreground">
        ← Produits
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Modifier le produit</h1>

      <ProductForm
        action={updateProduct.bind(null, product.id)}
        categories={categories}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          name: product.name,
          categoryId: product.categoryId,
          priceDh: Math.round(product.priceCents / 100),
          description: product.description,
          archived: product.archived,
          variants: product.variants.map((variant) => ({
            size: variant.size,
            stock: variant.stock,
          })),
          images: product.images.map((image) => ({ id: image.id, url: image.url })),
          videoUrl: product.videoUrl,
        }}
      />
    </div>
  );
}
