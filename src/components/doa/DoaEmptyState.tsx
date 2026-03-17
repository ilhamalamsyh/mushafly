const DoaEmptyState = () => {
  return (
    <section className="rounded-2xl border border-dashed border-emerald-400/50 bg-white/80 px-6 py-12 text-center dark:bg-[#0f1a30]/80">
      <p className="text-4xl">🔎</p>
      <h3 className="mt-3 text-lg font-semibold text-black dark:text-white">
        Doa tidak ditemukan
      </h3>
      <p className="mt-1 text-sm text-black/70 dark:text-white/70">
        Coba ubah kata kunci pencarian atau reset filter kategori dan tag.
      </p>
    </section>
  );
};

export default DoaEmptyState;
