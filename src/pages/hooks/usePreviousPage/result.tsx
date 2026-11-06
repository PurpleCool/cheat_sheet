import { useId, useState } from "react";
import { usePrevious } from "./usePrevious";

function Demo() {
  const inputId = useId();
  const [value, setValue] = useState("Hello!");
  const [, setRenderCount] = useState(0);
  const previous = usePrevious(value);

  return (
    <div>
      <label htmlFor={inputId}>Текущее значение</label>{" "}
      <input
        id={inputId}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <p role="status" aria-label="Предыдущее значение">
        Предыдущее значение: {previous === undefined ? "undefined" : JSON.stringify(previous)}
      </p>
      <button type="button" onClick={() => setRenderCount((count) => count + 1)}>
        Рендер без изменения значения
      </button>
    </div>
  );
}

export default function Result() {
  const [instance, setInstance] = useState(0);

  return (
    <section className="result" aria-label="Демонстрация usePrevious">
      <p>
        При первом рендере предыдущее значение — undefined. Измените текст, чтобы
        увидеть значение из предыдущего рендера. Эффект сохраняет текущее значение
        в ref, но сам не вызывает рендер. Поэтому при рендере без изменения текста
        предыдущее и текущее значения совпадут.
      </p>
      <Demo key={instance} />
      <button type="button" onClick={() => setInstance((value) => value + 1)}>
        Пересоздать компонент
      </button>
    </section>
  );
}
