import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <div
      className={cn(
        "font-mooner-outline font-bold tracking-tight",
        sizeMap[size],
        className
      )}
      style={{ fontFamily: "Mooner Outline" }}
    >
      <span className="text-white">MATTHEW</span>
    </div>
  );
}
