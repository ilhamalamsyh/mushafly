import { Link } from "react-router-dom";
import { ROUTES } from "../constants";
import type { Surah } from "../models/surah.model";
import GlassCard from "./GlassCard";

interface SurahCardProps {
  surah: Surah;
}

const SurahCard = ({ surah }: SurahCardProps) => {
  return (
    <Link
      to={ROUTES.surahDetail(surah.nomor)}
      className="block focus-visible:rounded-2xl"
    >
      <GlassCard className="h-full p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/65">
              {surah.tempatTurun}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-ink">
              {surah.namaLatin}
            </h3>
            <p className="text-sm text-ink/70">{surah.arti}</p>
          </div>
          <div className="rounded-lg bg-sea/15 px-3 py-1 text-sm font-semibold text-sea">
            {surah.nomor}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="arabic-text text-2xl" dir="rtl" lang="ar">
            {surah.nama}
          </p>
          <p className="text-xs text-ink/65">{surah.jumlahAyat} ayat</p>
        </div>
      </GlassCard>
    </Link>
  );
};

export default SurahCard;
