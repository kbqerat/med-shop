export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-4 w-64 animate-pulse rounded bg-surface" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-surface" />
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-surface" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-surface" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-surface" />
          <div className="h-24 w-full animate-pulse rounded bg-surface" />
          <div className="h-11 w-40 animate-pulse rounded bg-surface" />
          <div className="h-12 w-full animate-pulse rounded-full bg-surface" />
        </div>
      </div>
    </div>
  );
}
