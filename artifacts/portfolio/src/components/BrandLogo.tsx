import { useThemeMode } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  eager?: boolean;
};

export function BrandLogo({ className, eager = false }: BrandLogoProps) {
  const { theme } = useThemeMode();

  return (
    <img
      src={theme === "dark" ? "/brand/ig-logo-dark.webp" : "/brand/ig-logo-light.webp"}
      alt="Ibrahim Ghaiyth logo"
      className={cn("object-contain", className)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}
