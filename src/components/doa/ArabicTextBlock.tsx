interface ArabicTextBlockProps {
  text: string;
}

const ArabicTextBlock = ({ text }: ArabicTextBlockProps) => {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
        Teks Arab
      </h3>
      <div
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-right font-arabic text-2xl leading-loose text-slate-800 dark:text-slate-100 sm:text-3xl"
        dir="rtl"
      >
        {text}
      </div>
    </section>
  );
};

export default ArabicTextBlock;
