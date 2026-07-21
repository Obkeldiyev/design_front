import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const init = useThemeStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={toggle}
      className={`relative inline-flex h-8 w-16 items-center rounded-full border border-border bg-muted transition-colors hover:bg-muted/80 ${className}`}
    >
      <span
        className={`absolute top-0.5 grid h-7 w-7 place-items-center rounded-full bg-background shadow-sm ring-1 ring-border transition-transform ${
          isDark ? "translate-x-8" : "translate-x-0.5"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-foreground" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-foreground" />
        )}
      </span>
      <Sun className={`absolute left-2 h-3.5 w-3.5 ${isDark ? "opacity-30" : "opacity-0"}`} />
      <Moon className={`absolute right-2 h-3.5 w-3.5 ${isDark ? "opacity-0" : "opacity-30"}`} />
    </button>
  );
}
