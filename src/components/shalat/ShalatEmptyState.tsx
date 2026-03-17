export default function ShalatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-cyan-500/50 rounded-lg bg-cyan-500/5">
      <span className="text-4xl mb-4">⏰</span>
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        Pilih Lokasi Anda
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
        Pilih provinsi dan kabupaten/kota untuk melihat jadwal shalat bulanan
      </p>
    </div>
  );
}
