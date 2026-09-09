import { useEffect, useState } from "react";

/** Delays reflecting `value` by `delayMs`, resetting the timer on every change — for debouncing search-as-you-type input. */
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
