import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // trigger enter animation
    const id = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className={`transition-transform duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
