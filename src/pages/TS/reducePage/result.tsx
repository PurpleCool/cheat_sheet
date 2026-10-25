import { useState } from "react";
import reduce from "./reduce";
import "./preview.css";

type ScenarioId = "sum" | "filter" | "index";

type User = {
  id: number;
  name: string;
};

type Scenario = {
  description: string;
  id: ScenarioId;
  input: unknown;
  run: () => unknown;
  title: string;
};

const numbers = [3, 7, 2, 9];
const words = ["typescript", "reduce", "generic", "callback"];
const users: User[] = [
  { id: 101, name: "Ada" },
  { id: 205, name: "Grace" },
  { id: 309, name: "Linus" },
];

const scenarios: Scenario[] = [
  {
    id: "sum",
    title: "Сумма чисел",
    description: "Аккумулятор и элементы имеют тип number.",
    input: numbers,
    run: () => reduce(numbers, (total: number, number: number) => total + number, 0),
  },
  {
    id: "filter",
    title: "Длинные слова",
    description: "Из массива строк собирается новый массив строк.",
    input: words,
    run: () => reduce(words, (longWords: string[], word: string) => {
      if (word.length >= 7) longWords.push(word);
      return longWords;
    }, []),
  },
  {
    id: "index",
    title: "Пользователи по id",
    description: "Массив объектов превращается в объект-словарь.",
    input: users,
    run: () => reduce(users, (usersById: Record<number, User>, user: User) => {
      usersById[user.id] = user;
      return usersById;
    }, {}),
  },
];

function format(value: unknown) {
  return JSON.stringify(value, null, 2) ?? String(value);
}

export default function Result() {
  const [outputs, setOutputs] = useState<Partial<Record<ScenarioId, string>>>({});

  const runScenario = (scenario: Scenario) => {
    try {
      const output = format(scenario.run());
      setOutputs((current) => ({
        ...current,
        [scenario.id]: output,
      }));
    } catch (error) {
      const output = error instanceof Error ? error.message : String(error);
      setOutputs((current) => ({
        ...current,
        [scenario.id]: output,
      }));
    }
  };

  return (
    <section className="reduce-preview" aria-label="Проверка reduce">
      <p className="reduce-preview__intro">
        Каждый сценарий вызывает реализацию из <code>reduce.ts</code>.
      </p>
      <div className="reduce-preview__scenarios">
        {scenarios.map((scenario) => (
          <article className="reduce-scenario" key={scenario.id}>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
            <div className="reduce-scenario__value">
              <strong>Вход</strong>
              <pre><code>{format(scenario.input)}</code></pre>
            </div>
            <div className="reduce-scenario__run">
              <button
                aria-label={`Запустить reduce: ${scenario.title}`}
                type="button"
                onClick={() => runScenario(scenario)}
              >
                Запустить reduce
              </button>
              <div className="reduce-scenario__value">
                <strong>Результат</strong>
                <div
                  aria-label={`Результат: ${scenario.title}`}
                  aria-live="polite"
                  role="status"
                >
                  <pre>{outputs[scenario.id] ?? "Ещё не запускался."}</pre>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
