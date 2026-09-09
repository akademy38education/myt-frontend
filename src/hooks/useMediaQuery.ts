import { useEffect, useState } from "react";

/** Small responsive-design helper, e.g. `useMediaQuery("(min-width: 1024px)")`. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    setMatches(mediaQueryList.matches);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
