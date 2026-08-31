export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-20 rounded bg-surface" />
      <div className="mt-2 h-8 w-40 rounded bg-surface" />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface" />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-56 rounded-2xl bg-surface" />
        <div className="h-56 rounded-2xl bg-surface" />
      </div>

      <div className="mt-8 h-64 rounded-2xl bg-surface" />
    </div>
  );
}
