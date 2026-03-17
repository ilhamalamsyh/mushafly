import ShalatEmptyState from "../components/shalat/ShalatEmptyState";
import JadwalShalatTable from "../components/shalat/JadwalShalatTable";
import KabkotaSelect from "../components/imsakiyah/KabkotaSelect";
import ShalatLoadingState from "../components/shalat/ShalatLoadingState";
import ProvinsiSelect from "../components/imsakiyah/ProvinsiSelect";
import TodayShalatCard from "../components/shalat/TodayShalatCard";
import BulanSelect from "../components/shalat/BulanSelect";
import { useJadwalShalatController } from "../controllers/useJadwalShalatController";
import { useQuranStore } from "../stores/quran.store";

const BULAN_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const JadwalShalatPage = () => {
  const {
    provinsiList,
    kabkotaList,
    selectedProvinsi,
    selectedKabkota,
    selectedBulan,
    jadwal,
    isLoadingProvinsi,
    isLoadingKabkota,
    isLoadingJadwal,
    error,
    activeTab,
    setActiveTab,
    onProvinsiChange,
    onKabkotaChange,
    onBulanChange,
    retryLastAction,
  } = useJadwalShalatController();

  const theme = useQuranStore((s: any) => s.theme);
  const toggleTheme = useQuranStore((s: any) => s.toggleTheme);
  const currentYear = new Date().getFullYear();

  return (
    <main className="mx-auto mt-6 max-w-6xl px-4 pb-12">
      <section className="rounded-2xl border border-[#e2d9c5] bg-[#fdf6e3]/85 p-5 shadow-glass transition-colors duration-300 dark:border-[#1e2d4a] dark:bg-[#0f1a30]/85">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
              {BULAN_NAMES[selectedBulan - 1]} {currentYear}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              Jadwal Shalat Bulanan
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-black/70 dark:text-white/70">
              Pilih provinsi dan kabupaten/kota untuk melihat jadwal shalat
              bulanan lengkap di seluruh Indonesia.
            </p>

            {/* Info badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                517 Kab/Kota
              </span>
              <span className="inline-flex items-center rounded-full bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                34 Provinsi
              </span>
              <span className="inline-flex items-center rounded-full bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                {currentYear}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="self-start rounded-xl border border-[#e2d9c5] bg-white px-3 py-2 text-sm text-black transition-colors hover:bg-[#f6ebd5] dark:border-[#1e2d4a] dark:bg-[#14223d] dark:text-white dark:hover:bg-[#1a2a48]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProvinsiSelect
            provinsiList={provinsiList}
            selectedProvinsi={selectedProvinsi}
            isLoading={isLoadingProvinsi}
            onChange={onProvinsiChange}
          />
          <KabkotaSelect
            kabkotaList={kabkotaList}
            selectedKabkota={selectedKabkota}
            selectedProvinsi={selectedProvinsi}
            isLoading={isLoadingKabkota}
            onChange={onKabkotaChange}
          />
          <BulanSelect value={selectedBulan} onChange={onBulanChange} />
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
              <button
                type="button"
                onClick={() => void retryLastAction()}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 whitespace-nowrap"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-6">
        {!jadwal && !isLoadingJadwal ? <ShalatEmptyState /> : null}

        {isLoadingJadwal ? <ShalatLoadingState /> : null}

        {jadwal && !isLoadingJadwal ? (
          <div className="animate-in fade-in duration-300">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "table"
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-white text-black hover:bg-[#f6ebd5] dark:bg-[#14223d] dark:text-white dark:hover:bg-[#1a2a48]"
                }`}
              >
                Jadwal Bulanan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("today")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "today"
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-white text-black hover:bg-[#f6ebd5] dark:bg-[#14223d] dark:text-white dark:hover:bg-[#1a2a48]"
                }`}
              >
                Hari Ini
              </button>
            </div>

            {activeTab === "table" ? (
              <JadwalShalatTable rows={jadwal.jadwal} />
            ) : (
              <TodayShalatCard jadwal={jadwal} />
            )}

            <div className="mt-6 border-t border-[#e2d9c5] pt-4 text-sm text-black/70 dark:border-[#1e2d4a] dark:text-white/70">
              <p>
                Data jadwal shalat tersedia melalui API untuk integrasi ke
                aplikasi Anda.
              </p>
              <a
                href="/docs"
                className="mt-2 inline-block rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700"
              >
                Lihat Dokumentasi API
              </a>

              <p className="mt-4 text-xs">
                Sumber data: Bimas Islam Kementerian Agama RI
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default JadwalShalatPage;
