import type { DoaItem } from "../../types/doa";
import { useToast } from "../../hooks/useToast";

interface DoaActionButtonsProps {
  doa: DoaItem;
}

const DoaActionButtons = ({ doa }: DoaActionButtonsProps) => {
  const { showToast } = useToast();

  const handleCopy = async () => {
    const text = `${doa.nama}\n\n${doa.ar}\n\n${doa.tr}\n\n${doa.idn}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast("Doa berhasil disalin!", "success");
    } catch {
      showToast("Gagal menyalin doa.", "error");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: doa.nama,
          text: doa.nama,
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      showToast("Link berhasil disalin!", "success");
    } catch {
      showToast("Gagal membagikan doa.", "error");
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="rounded-xl border border-emerald-500/40 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-300"
      >
        Salin
      </button>
      <button
        type="button"
        onClick={() => void handleShare()}
        className="rounded-xl border border-emerald-500/40 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-300"
      >
        Bagikan
      </button>
    </div>
  );
};

export default DoaActionButtons;
