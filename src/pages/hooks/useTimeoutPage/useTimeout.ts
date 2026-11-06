import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [delay]);
}
