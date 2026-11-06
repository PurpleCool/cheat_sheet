import { useEffect, useRef, useState } from "react";

export function useThrottleWithLeading<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState(value);

  const valueRef = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    valueRef.current = value;

    if (timerRef.current !== null) {
      return;
    }

    if (throttledValue === valueRef.current) {
      return;
    }

    setThrottledValue(valueRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setThrottledValue(valueRef.current);
    }, delay);
  }, [value, delay]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return throttledValue;
}
