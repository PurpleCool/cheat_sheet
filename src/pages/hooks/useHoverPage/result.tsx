import { useState } from "react";
import { useHover } from "./useHover";

export default function Result() {
  const [ref, isHovered] = useHover<HTMLDivElement>();
  const [visible, setVisible] = useState(true);
  const [elementNumber, setElementNumber] = useState(1);

  return (
    <section className="result" aria-label="Демонстрация useHover">
      <p>
        Наведите указатель на область и уберите его, чтобы увидеть true и false.
        Можно заменить или скрыть область и проверить, что хук отслеживает
        подключённый элемент. На сенсорном экране постоянное наведение может быть
        недоступно.
      </p>
      <div>
        <button type="button" onClick={() => setVisible((value) => !value)}>
          {visible ? "Скрыть область" : "Показать область"}
        </button>{" "}
        <button
          type="button"
          disabled={!visible}
          onClick={() => setElementNumber((value) => value + 1)}
        >
          Заменить элемент
        </button>
      </div>
      {visible && (
        <div
          key={elementNumber}
          ref={ref}
          role="region"
          aria-label="Область наведения"
          style={{
            border: "2px solid currentColor",
            borderRadius: "0.5rem",
            marginBlock: "1rem",
            padding: "2rem",
          }}
        >
          Область №{elementNumber}: {isHovered ? "указатель внутри" : "указатель снаружи"}
        </div>
      )}
      <p role="status" aria-label="Состояние наведения">
        isHovered: {String(isHovered)}
      </p>
    </section>
  );
}
