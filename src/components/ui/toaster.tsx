import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

/**
 * Sonner manages its own light/dark styling via a `theme` prop — it does
 * NOT read Tailwind's `.dark` class automatically. `StudentLayout` toggles
 * that class directly on `document.documentElement` (so Radix portals pick
 * it up too), so this watches for that same class with a `MutationObserver`
 * rather than needing a shared store just for this.
 */
function useDocumentTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

/**
 * Global toast host, mounted once in `app/AppProviders.tsx`. Trigger toasts
 * from anywhere with `toast.success(...)` / `toast.error(...)` imported
 * from "sonner" — no need to route through this component.
 */
export function Toaster() {
  const theme = useDocumentTheme();
  return (
    <Sonner
      theme={theme}
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  );
}
