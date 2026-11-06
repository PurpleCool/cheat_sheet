import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const prev = useRef<T | undefined>(undefined);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
}
