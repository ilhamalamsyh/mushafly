const EmptyState = () => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#e2d9c5] bg-white/70 px-6 py-10 text-center dark:border-[#1e2d4a] dark:bg-[#0f1a30]/60">
      <p className="text-4xl">🌙</p>
      <h3 className="mt-3 text-lg font-semibold text-black dark:text-white">
        Pilih lokasi terlebih dahulu
      </h3>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        Pilih provinsi dan kabupaten/kota untuk menampilkan jadwal imsakiyah
        Ramadhan 1447H / 2026M.
      </p>
    </div>
  );
};

export default EmptyState;
