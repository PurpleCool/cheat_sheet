import { useState } from "react";
import flattenMenu from "./flattenMenu";
import { scenarios } from "./scenarios";

type CheckResult = { text: string; passed: boolean; unchanged: boolean };

export default function Result() {
  const [outputs, setOutputs] = useState<CheckResult[] | null>(null);

  const runChecks = () => {
    setOutputs(scenarios.map(({ input, expected }) => {
      const items = structuredClone(input);
      const before = JSON.stringify(items);
      try {
        const actual = flattenMenu(items);
        const unchanged = JSON.stringify(items) === before;
        return {
          text: JSON.stringify(actual),
          unchanged,
          passed: unchanged && actual.length === expected.length && actual.every((item, index) =>
            item.id === expected[index].id &&
            item.title === expected[index].title &&
            item.depth === expected[index].depth &&
            item.parentId === expected[index].parentId),
        };
      } catch (error) {
        return {
          text: `Ошибка: ${error instanceof Error ? error.message : String(error)}`,
          passed: false,
          unchanged: JSON.stringify(items) === before,
        };
      }
    }));
  };

  return (
    <section className="result" aria-label="Проверка flattenMenu">
      <button type="button" onClick={runChecks}>Запустить проверку</button>
      <div aria-live="polite" role="status">
        {outputs === null ? <p>Проверка ещё не запускалась.</p> : (
          <ol>
            {scenarios.map(({ name, input, expected }, index) => (
              <li key={name}>
                <strong>{name}</strong>
                <p>{outputs[index].passed ? "Пройдено" : "Не пройдено"}</p>
                <p>Вход: <code>{JSON.stringify(input)}</code></p>
                <p>Результат: <code>{outputs[index].text}</code></p>
                <p>Ожидается: <code>{JSON.stringify(expected)}</code></p>
                <p>{outputs[index].unchanged ? "Входные данные не изменены" : "Входные данные изменены"}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
