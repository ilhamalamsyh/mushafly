import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface GlassCardProps extends PropsWithChildren {
  className?: string;
}

const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <section
      className={clsx(
        "glass-card transition hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </section>
  );
};

export default GlassCard;
