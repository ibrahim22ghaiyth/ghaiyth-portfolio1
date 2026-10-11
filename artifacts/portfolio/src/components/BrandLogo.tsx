import { useThemeMode } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  eager?: boolean;
  /** Force a specific logo variant regardless of current theme. */
  variant?: "dark" | "light";
};

export function BrandLogo({ className, eager = false, variant }: BrandLogoProps) {
  const { theme } = useThemeMode();

  const resolved = variant ?? (theme === "dark" ? "dark" : "light");

  return (
    <img
      src={resolved === "dark" ? "/brand/ig-logo-dark.webp" : "/brand/ig-logo-light.webp"}
      alt="Ibrahim Ghaiyth logo"
      className={cn("object-contain", className)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}
