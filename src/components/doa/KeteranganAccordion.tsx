import { useEffect, useState } from "react";

interface KeteranganAccordionProps {
  text: string;
}

const KeteranganAccordion = ({ text }: KeteranganAccordionProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setOpen(media.matches);

    const handler = (event: MediaQueryListEvent) => setOpen(event.matches);
    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2d9c5] dark:border-[#1e2d4a]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-l-4 border-emerald-500 bg-white px-4 py-3 text-left text-sm font-semibold text-black dark:bg-[#13213a] dark:text-white"
      >
        <span>Keterangan & Dalil</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      <div
        className={`transition-all duration-300 ${
          open ? "max-h-[640px]" : "max-h-0"
        }`}
      >
        <div className="border-l-4 border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-black/70 whitespace-pre-line dark:text-white/70">
          {text}
        </div>
      </div>
    </section>
  );
};

export default KeteranganAccordion;
