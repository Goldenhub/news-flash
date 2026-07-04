export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-neutral-200/70 bg-white overflow-hidden dark:border-neutral-700/50 dark:bg-neutral-800/80">
          <div className="aspect-[16/10] bg-neutral-200 animate-pulse dark:bg-neutral-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-neutral-200 rounded-lg animate-pulse w-3/4 dark:bg-neutral-700" />
            <div className="h-3 bg-neutral-200 rounded-lg animate-pulse w-full dark:bg-neutral-700" />
            <div className="h-3 bg-neutral-200 rounded-lg animate-pulse w-1/3 dark:bg-neutral-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
