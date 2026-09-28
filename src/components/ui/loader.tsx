// Three bouncing squares. Fades in after a short delay so fast navigations
// never flash it - it only appears when a page is actually slow.
export function Loader({ label = "Duke ngarkuar" }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="loader flex items-end gap-2">
      <span className="loader-square bg-ink" />
      <span className="loader-square bg-ink" />
      <span className="loader-square bg-red" />
    </div>
  );
}
