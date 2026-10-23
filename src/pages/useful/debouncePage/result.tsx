import { useEffect, useId, useState } from "react";
import debounce from "./debounce";

export default function Result() {
  const messageId = useId();
  const [output, setOutput] = useState<string[]>([]);
  const [debounced] = useState(() =>
    debounce((value: string) => {
      setOutput((messages) => [...messages, value]);
    }, 2000),
  );

  useEffect(() => () => debounced.cancel(), [debounced]);

  return (
    <section className="result" aria-label="Демонстрация debounce">
      <p>
        Задержка: 2000 мс. Ввод, вставка или удаление текста передаёт текущее
        сообщение в обёртку и перезапускает ожидание. flush() выполняет ожидающий
        вызов сразу, cancel() отменяет его.
      </p>
      <label htmlFor={messageId}>Сообщение</label>
      <input
        id={messageId}
        defaultValue="hello"
        onInput={(event) => debounced(event.currentTarget.value)}
      />
      <div>
        <button type="button" onClick={() => debounced.flush()}>
          flush()
        </button>{" "}
        <button type="button" onClick={() => debounced.cancel()}>
          cancel()
        </button>
      </div>
      <h3>Вывод</h3>
      <div role="log" aria-label="Вывод">
        {output.length === 0 ? (
          <p>Вызовов пока нет.</p>
        ) : (
          <ol>
            {output.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
