import { useState } from "react";
import getUserStats from "./getUserStats";
import { scenarios } from "./scenarios";

export default function Result() {
  const [outputs, setOutputs] = useState<{ text: string; passed: boolean }[] | null>(null);

  const runChecks = () => {
    setOutputs(scenarios.map(({ input, expected }) => {
      try {
        const orders = structuredClone(input);
        orders.forEach(Object.freeze);
        Object.freeze(orders);
        const actual = getUserStats(orders);
        return {
          text: JSON.stringify(actual),
          passed: actual.length === expected.length && actual.every((stats, index) =>
            stats.userId === expected[index].userId &&
            stats.count === expected[index].count &&
            stats.total === expected[index].total),
        };
      } catch (error) {
        return { text: `Ошибка: ${error instanceof Error ? error.message : String(error)}`, passed: false };
      }
    }));
  };

  return (
    <section className="result" aria-label="Проверка getUserStats">
      <button type="button" onClick={runChecks}>Запустить проверку</button>
      <div aria-live="polite" role="status">
        {outputs === null ? <p>Проверка ещё не запускалась.</p> : (
          <ol>
            {scenarios.map(({ name, expected }, index) => (
              <li key={name}>
                <strong>{name}</strong>
                <p>{outputs[index].passed ? "Пройдено" : "Не пройдено"}</p>
                <p>Результат: <code>{outputs[index].text}</code></p>
                <p>Ожидается: <code>{JSON.stringify(expected)}</code></p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
