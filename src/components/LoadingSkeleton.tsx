export default function LoadingSkeleton({ view }: { view?: string }) {
  if (view === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl border border-teal-border/60 bg-teal-card overflow-hidden p-3">
            <div className="w-24 h-24 shrink-0 rounded-xl bg-white/10 animate-pulse" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3 bg-white/10 rounded-lg animate-pulse w-1/4" />
              <div className="h-4 bg-white/10 rounded-lg animate-pulse w-3/4" />
              <div className="h-3 bg-white/10 rounded-lg animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-teal-border/60 bg-teal-card overflow-hidden">
          <div className="aspect-[16/10] bg-white/10 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-white/10 rounded-lg animate-pulse w-3/4" />
            <div className="h-3 bg-white/10 rounded-lg animate-pulse w-full" />
            <div className="h-3 bg-white/10 rounded-lg animate-pulse w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
