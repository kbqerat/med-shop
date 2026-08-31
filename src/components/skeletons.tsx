/** Shared loading placeholders for route-level `loading.tsx` files and hydration gaps. */

export function Spinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-surface-border border-t-accent ${className}`}
    />
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-surface-border bg-surface"
        >
          <div className="aspect-square w-full animate-pulse bg-background" />
          <div className="space-y-2 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-background" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-background" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-background" />
          </div>
        </div>
      ))}
    </div>
  );
}
