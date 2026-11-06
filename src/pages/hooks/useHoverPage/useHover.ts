import { useCallback, useRef, useState } from "react";
import type { RefCallback } from "react";

export function useHover<T extends HTMLElement>(): [RefCallback<T>, boolean] {
  const [isHovered, setIsHovered] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const ref = useCallback((element: T | null) => {
    // Убираем подписки с предыдущего элемента
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!element) {
      setIsHovered(false);
      return;
    }

    const handleHover = () => setIsHovered(true);
    const handleUnHover = () => setIsHovered(false);

    element.addEventListener("pointerenter", handleHover);
    element.addEventListener("pointerleave", handleUnHover);

    // Проверяем первоначальное состояние
    setIsHovered(element.matches(":hover"));

    // Сохраняем функцию очистки для этого элемента
    cleanupRef.current = () => {
      element.removeEventListener("pointerenter", handleHover);
      element.removeEventListener("pointerleave", handleUnHover);
    };
  }, []);

  return [ref, isHovered];
}
