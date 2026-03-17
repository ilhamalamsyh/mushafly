const Bar = ({ className }: { className: string }) => (
  <div className={`rounded bg-black/10 dark:bg-white/10 ${className}`} />
);

const DoaDetailSkeleton = () => {
  return (
    <section className="animate-pulse rounded-2xl border border-[#e2d9c5] bg-white p-5 dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
      <Bar className="h-8 w-2/3" />
      <Bar className="mt-3 h-5 w-1/3" />
      <div className="mt-6 space-y-4">
        <Bar className="h-40 w-full" />
        <Bar className="h-24 w-full" />
        <Bar className="h-24 w-full" />
        <Bar className="h-32 w-full" />
      </div>
    </section>
  );
};

export default DoaDetailSkeleton;
