const Spinner = () => {
  return (
    <div
      className="flex items-center gap-3 text-sm text-black/80 dark:text-white/80"
      role="status"
      aria-live="polite"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sea border-t-transparent" />
      Loading...
    </div>
  );
};

export default Spinner;
