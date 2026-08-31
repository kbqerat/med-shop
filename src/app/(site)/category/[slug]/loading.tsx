import { ProductGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-4 w-52 animate-pulse rounded bg-surface" />
      <div className="mt-6 h-10 w-64 animate-pulse rounded bg-surface" />
      <div className="mt-3 h-4 w-40 animate-pulse rounded bg-surface" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
