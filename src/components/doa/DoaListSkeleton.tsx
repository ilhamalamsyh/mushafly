const SkeletonCard = () => (
  <article className="rounded-2xl border border-[#e2d9c5] bg-white p-4 dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
    <div className="h-6 w-1/2 rounded bg-black/10 dark:bg-white/10" />
    <div className="mt-4 h-6 w-3/4 rounded bg-black/10 dark:bg-white/10" />
    <div className="mt-2 h-4 w-full rounded bg-black/10 dark:bg-white/10" />
    <div className="mt-2 h-4 w-[85%] rounded bg-black/10 dark:bg-white/10" />
    <div className="mt-4 flex gap-2">
      <div className="h-6 w-14 rounded-full bg-black/10 dark:bg-white/10" />
      <div className="h-6 w-14 rounded-full bg-black/10 dark:bg-white/10" />
    </div>
    <div className="mt-4 h-10 w-full rounded-xl bg-black/10 dark:bg-white/10" />
  </article>
);

const DoaListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 animate-pulse sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default DoaListSkeleton;
