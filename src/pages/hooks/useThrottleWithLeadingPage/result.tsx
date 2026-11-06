import { useId, useState } from "react";
import { useThrottleWithLeading } from "./useThrottleWithLeading";

export default function Result() {
  const inputId = useId();
  const delayId = useId();
  const [value, setValue] = useState("");
  const [delay, setDelay] = useState(2000);
  const throttledValue = useThrottleWithLeading(value, delay);

  return (
    <section className="result" aria-label="Демонстрация useThrottleWithLeading">
      <p>
        Введите несколько символов подряд. Первый появится в результате сразу,
        остальные — последним значением после задержки. После срабатывания таймера
        новое изменение снова проходит сразу. Смена задержки влияет только на
        следующий таймер.
      </p>
      <label htmlFor={inputId}>Текущее значение</label>{" "}
      <input
        id={inputId}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />{" "}
      <label htmlFor={delayId}>Задержка</label>{" "}
      <select
        id={delayId}
        value={delay}
        onChange={(event) => setDelay(Number(event.currentTarget.value))}
      >
        <option value={1000}>1000 мс</option>
        <option value={2000}>2000 мс</option>
        <option value={5000}>5000 мс</option>
      </select>
      <p role="status" aria-label="Результат throttle">
        Результат: {JSON.stringify(throttledValue)}
      </p>
    </section>
  );
}
