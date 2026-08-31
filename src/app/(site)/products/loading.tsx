import { ProductGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-4 w-40 animate-pulse rounded bg-surface" />
      <div className="mt-6 h-3 w-24 animate-pulse rounded bg-surface" />
      <div className="mt-2 h-10 w-56 animate-pulse rounded bg-surface" />
      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-surface" />
      <div className="mt-6 h-10 animate-pulse rounded-full bg-surface" />
      <div className="mt-6 h-20 animate-pulse rounded-2xl bg-surface" />
      <ProductGridSkeleton count={12} />
    </div>
  );
}
