import { cn } from "@/lib/utils";

interface DifficultyDotsProps {
  level: 1 | 2 | 3 | 4 | 5;
  label?: string;
  className?: string;
}

const difficultyLabel = ["", "Easy", "Moderate", "Moderate+", "Challenging", "Expert"];

export function DifficultyDots({ level, label, className }: DifficultyDotsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-[5px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "w-[9px] h-[9px] rounded-full",
              i < level ? "bg-forest" : "bg-divider"
            )}
          />
        ))}
      </div>
      <span className="font-mono text-[11px] text-ink/45 tracking-[0.08em] uppercase">
        {label ?? difficultyLabel[level]}
      </span>
    </div>
  );
}
