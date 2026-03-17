interface TransliterasiBlockProps {
  text: string;
}

const TransliterasiBlock = ({ text }: TransliterasiBlockProps) => {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
        Transliterasi
      </h3>
      <div className="rounded-2xl border border-[#e2d9c5] bg-white p-4 text-base italic leading-relaxed text-slate-600 dark:border-[#1e2d4a] dark:bg-[#13213a] dark:text-slate-300">
        {text}
      </div>
    </section>
  );
};

export default TransliterasiBlock;
