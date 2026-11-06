import { useId, useState } from "react";
import { useTimeout } from "./useTimeout";

export default function Result() {
  const messageId = useId();
  const delayId = useId();
  const [message, setMessage] = useState("Hello!");
  const [delay, setDelay] = useState(5000);
  const [output, setOutput] = useState<string[]>([]);

  useTimeout(() => {
    setOutput((messages) => [...messages, message]);
  }, delay);

  return (
    <section className="result" aria-label="Демонстрация useTimeout">
      <p>
        Таймер запускается при открытии примера. Изменение сообщения обновляет
        callback без перезапуска таймера. Выбор другой задержки запускает новое
        ожидание. Каждый таймер срабатывает один раз и выводит последнее сообщение.
      </p>
      <label htmlFor={messageId}>Сообщение</label>{" "}
      <input
        id={messageId}
        value={message}
        onChange={(event) => setMessage(event.currentTarget.value)}
      />{" "}
      <label htmlFor={delayId}>Задержка</label>{" "}
      <select
        id={delayId}
        value={delay}
        onChange={(event) => setDelay(Number(event.currentTarget.value))}
      >
        <option value={2000}>2000 мс</option>
        <option value={5000}>5000 мс</option>
        <option value={10000}>10000 мс</option>
      </select>
      <h3>Вывод</h3>
      <div role="log" aria-label="Вывод таймера">
        {output.length === 0 ? (
          <p>Вызовов пока нет.</p>
        ) : (
          <ol>
            {output.map((value, index) => <li key={index}>{value}</li>)}
          </ol>
        )}
      </div>
    </section>
  );
}
