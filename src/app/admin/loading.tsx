export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Duke ngarkuar" className="animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 bg-ink/[0.06]" />
        <div className="h-7 w-64 bg-ink/[0.08]" />
        <div className="h-3.5 w-80 max-w-full bg-ink/[0.06]" />
      </div>
      <div className="border border-line bg-paper">
        <div className="h-12 border-b border-line bg-surface/60" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-line px-5 py-4 last:border-b-0">
            <div className="h-9 w-9 shrink-0 bg-ink/[0.06]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-ink/[0.07]" />
              <div className="h-2.5 w-1/4 bg-ink/[0.05]" />
            </div>
            <div className="h-5 w-16 bg-ink/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  );
}
