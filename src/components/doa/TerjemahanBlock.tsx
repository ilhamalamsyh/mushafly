interface TerjemahanBlockProps {
  text: string;
}

const TerjemahanBlock = ({ text }: TerjemahanBlockProps) => {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
        Terjemahan
      </h3>
      <div className="rounded-2xl border border-[#e2d9c5] bg-white p-4 text-justify text-base leading-relaxed text-black/80 dark:border-[#1e2d4a] dark:bg-[#13213a] dark:text-white/80">
        {text}
      </div>
    </section>
  );
};

export default TerjemahanBlock;
