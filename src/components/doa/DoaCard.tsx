import type { DoaItem } from "../../types/doa";

interface DoaCardProps {
  doa: DoaItem;
  onBaca: (id: number) => void;
  onBagikan: (doa: DoaItem) => void;
}

const DoaCard = ({ doa, onBaca, onBagikan }: DoaCardProps) => {
  return (
    <article className="rounded-2xl border-l-4 border border-[#e2d9c5] border-l-emerald-500 bg-white p-4 shadow-glass transition duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:border-[#1e2d4a] dark:bg-[#0f1a30]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="inline-flex rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
          {doa.grup}
        </span>
      </div>

      <h3 className="line-clamp-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
        {doa.nama}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm text-black/70 dark:text-white/70 whitespace-pre-line">
        {doa.tentang}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {doa.tag.map((item) => (
          <span
            key={`${doa.id}-${item}`}
            className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
          >
            #{item}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onBaca(doa.id)}
          className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Baca
        </button>
        <button
          type="button"
          onClick={() => onBagikan(doa)}
          className="rounded-xl border border-emerald-400/40 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-300"
          aria-label={`Bagikan ${doa.nama}`}
        >
          Bagikan
        </button>
      </div>
    </article>
  );
};

export default DoaCard;
