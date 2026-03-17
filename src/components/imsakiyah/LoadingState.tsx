const LoadingState = () => {
  return (
    <div className="rounded-2xl border border-[#e2d9c5] bg-white p-4 dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
      <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 animate-pulse rounded-lg bg-black/10 dark:bg-white/10"
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
