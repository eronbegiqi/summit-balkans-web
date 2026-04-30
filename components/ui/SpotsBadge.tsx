import { cn } from "@/lib/utils";
import { isLowAvailability } from "@/lib/utils";

interface SpotsBadgeProps {
  spotsLeft: number;
  spotsTotal: number;
  className?: string;
}

export function SpotsBadge({ spotsLeft, spotsTotal, className }: SpotsBadgeProps) {
  if (spotsLeft === 0) {
    return (
      <span className={cn("font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-ink/10 text-ink/50 tracking-[0.04em]", className)}>
        Sold out
      </span>
    );
  }

  const urgent = isLowAvailability(spotsLeft);

  return (
    <span
      className={cn(
        "font-mono text-[10px] font-medium px-2 py-0.5 rounded tracking-[0.04em]",
        urgent ? "bg-gold text-ink" : "bg-ink/7 text-ink",
        className
      )}
    >
      {spotsLeft} / {spotsTotal} spots left
    </span>
  );
}
