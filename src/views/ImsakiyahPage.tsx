import EmptyState from "../components/imsakiyah/EmptyState";
import JadwalTable from "../components/imsakiyah/JadwalTable";
import KabkotaSelect from "../components/imsakiyah/KabkotaSelect";
import LoadingState from "../components/imsakiyah/LoadingState";
import ProvinsiSelect from "../components/imsakiyah/ProvinsiSelect";
import TodayCard from "../components/imsakiyah/TodayCard";
import { useImsakiyahController } from "../controllers/useImsakiyahController";
import { useQuranStore } from "../stores/quran.store";

// Bimas schedule day can differ from Intl Islamic calendar by one day.
const HIJRI_DAY_OFFSET = -1;

const getRamadhanDay = (date: Date): number | null => {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "numeric",
    }).formatToParts(date);

    const day = Number(parts.find((part) => part.type === "day")?.value ?? "");
    const month = Number(
      parts.find((part) => part.type === "month")?.value ?? "",
    );

    if (!Number.isFinite(day) || !Number.isFinite(month)) {
      return null;
    }

    // In Islamic calendar, Ramadan is month 9.
    if (month !== 9) {
      return null;
    }

    const adjustedDay = day + HIJRI_DAY_OFFSET;
    return Math.min(30, Math.max(1, adjustedDay));
  } catch {
    return null;
  }
};

const ImsakiyahPage = () => {
  const {
    provinsiList,
    kabkotaList,
    selectedProvinsi,
    selectedKabkota,
    jadwal,
    isLoadingProvinsi,
    isLoadingKabkota,
    isLoadingJadwal,
    error,
    activeTab,
    setActiveTab,
    onProvinsiChange,
    onKabkotaChange,
    retryLastAction,
  } = useImsakiyahController();

  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);
  const ramadhanDay = getRamadhanDay(new Date()) ?? new Date().getDate();

  const todayEntry =
    jadwal?.imsakiyah.find((item) => item.tanggal === ramadhanDay) ?? null;

  return (
    <main className="mx-auto mt-6 max-w-6xl px-4 pb-12">
      <section className="rounded-2xl border border-[#e2d9c5] bg-[#fdf6e3]/85 p-5 shadow-glass transition-colors duration-300 dark:border-[#1e2d4a] dark:bg-[#0f1a30]/85">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 dark:text-amber-300">
              Ramadhan 1447H / 2026M
            </p>
            <h1 className="mt-2 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              Jadwal Imsakiyah Indonesia
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-black/70 dark:text-white/70">
              Pilih provinsi dan kabupaten/kota untuk melihat jadwal imsak,
              waktu shalat, dan waktu berbuka puasa.
            </p>
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

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>⚠️ {error}</p>
              <button
                type="button"
                onClick={() => void retryLastAction()}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-6">
        {!jadwal && !isLoadingJadwal ? <EmptyState /> : null}

        {isLoadingJadwal ? <LoadingState /> : null}

        {jadwal && !isLoadingJadwal ? (
          <div className="animate-in fade-in duration-300">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "table"
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-white text-black hover:bg-[#f6ebd5] dark:bg-[#14223d] dark:text-white dark:hover:bg-[#1a2a48]"
                }`}
              >
                Jadwal Lengkap
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("today")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "today"
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-white text-black hover:bg-[#f6ebd5] dark:bg-[#14223d] dark:text-white dark:hover:bg-[#1a2a48]"
                }`}
              >
                Hari Ini
              </button>
            </div>

            {activeTab === "table" ? (
              <JadwalTable rows={jadwal.imsakiyah} highlightDay={ramadhanDay} />
            ) : (
              <TodayCard todayEntry={todayEntry} />
            )}

            <div className="mt-6 border-t border-[#e2d9c5] pt-4 text-sm text-black/70 dark:border-[#1e2d4a] dark:text-white/70">
              <p>
                Data jadwal imsakiyah tersedia melalui API untuk integrasi ke
                aplikasi Anda.
              </p>
              <a
                href="/docs"
                className="mt-2 inline-block rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
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

export default ImsakiyahPage;
