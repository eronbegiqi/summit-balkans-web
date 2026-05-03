import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export function SectionLabel({ children, className, light }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "font-mono text-[12px] font-medium tracking-[0.14em] uppercase mb-3",
        light ? "text-white/35" : "text-terra",
        className
      )}
    >
      {children}
    </div>
  );
}
