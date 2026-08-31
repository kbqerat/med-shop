import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm font-medium text-muted hover:text-foreground">
        ← Produits
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Ajouter un produit</h1>

      <ProductForm action={createProduct} categories={categories} submitLabel="Ajouter un produit" />
    </div>
  );
}
