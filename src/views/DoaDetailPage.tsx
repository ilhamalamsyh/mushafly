import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArabicTextBlock from "../components/doa/ArabicTextBlock";
import DoaActionButtons from "../components/doa/DoaActionButtons";
import DoaDetailSkeleton from "../components/doa/DoaDetailSkeleton";
import KeteranganAccordion from "../components/doa/KeteranganAccordion";
import TerjemahanBlock from "../components/doa/TerjemahanBlock";
import TransliterasiBlock from "../components/doa/TransliterasiBlock";
import { useDoaDetailController } from "../controllers/useDoaDetailController";

const DoaDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const doaId = Number.parseInt(id ?? "", 10);

  const { doa, isLoading, error, refetch } = useDoaDetailController(doaId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [doaId]);

  return (
    <main className="mx-auto mt-6 max-w-4xl px-4 pb-12">
      <button
        type="button"
        onClick={() => navigate("/doa")}
        className="rounded-xl border border-[#e2d9c5] bg-white px-3 py-2 text-sm font-medium text-black hover:bg-[#f6ebd5] dark:border-[#1e2d4a] dark:bg-[#14223d] dark:text-white dark:hover:bg-[#1a2a48]"
      >
        ← Kembali ke Daftar Doa
      </button>

      <section className="mt-4 rounded-2xl border border-[#e2d9c5] bg-[#fdf6e3]/85 p-5 shadow-glass dark:border-[#1e2d4a] dark:bg-[#0f1a30]/85">
        {isLoading ? <DoaDetailSkeleton /> : null}

        {!isLoading && (error || !doa) ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-5 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <p className="font-semibold">Doa tidak ditemukan</p>
            <p className="mt-1">{error ?? "Data doa tidak tersedia."}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Coba Lagi
              </button>
              <button
                type="button"
                onClick={() => navigate("/doa")}
                className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-500/10 dark:text-red-200"
              >
                Kembali
              </button>
            </div>
          </div>
        ) : null}

        {!isLoading && doa ? (
          <div className="space-y-5">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                  Detail Doa
                </p>
                <h1 className="mt-2 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  {doa.nama}
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    {doa.grup}
                  </span>
                  {doa.tag.map((item) => (
                    <span
                      key={`${doa.id}-${item}`}
                      className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
                    >
                      #{item}
                    </span>
                  ))}
                </div>
              </div>

              <DoaActionButtons doa={doa} />
            </header>

            <ArabicTextBlock text={doa.ar} />
            <TransliterasiBlock text={doa.tr} />
            <TerjemahanBlock text={doa.idn} />
            <KeteranganAccordion text={doa.tentang} />
          </div>
        ) : null}
      </section>

      <footer className="mt-8 border-t border-[#e2d9c5] pt-4 text-xs text-black/70 dark:border-[#1e2d4a] dark:text-white/70">
        Sumber data: Bimas Islam Kementerian Agama RI
      </footer>
    </main>
  );
};

export default DoaDetailPage;
