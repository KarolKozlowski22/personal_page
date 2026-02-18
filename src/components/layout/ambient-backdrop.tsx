export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-28 left-[6%] h-72 w-72 rounded-full bg-primary/15 blur-2xl" />
      <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-orange-300/15 blur-2xl dark:bg-orange-400/10" />
      <div className="absolute bottom-[-8%] left-1/3 h-72 w-72 rounded-full bg-sky-300/10 blur-2xl dark:bg-sky-400/10" />
    </div>
  );
}
