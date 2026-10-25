import { useState } from "react";
import {
  type GetJson,
  type JsonResponse,
  type LogError,
} from "./asyncAwait";
import * as asyncAwaitExercise from "./asyncAwait";
import "./preview.css";

type Resource = Parameters<GetJson>[0];
type ImplementationId = "promise" | "async";
type MockResponse = JsonResponse | Error;
type ScenarioId = "success" | "missing-key" | "second-request-error";

type Scenario = {
  description: string;
  id: ScenarioId;
  responses: Record<Resource, MockResponse>;
  title: string;
};

type RunState = {
  events: string[];
  phase: "idle" | "running" | "done";
  result?: string;
};

type ExerciseFunction = (
  getJson: GetJson,
  logError?: LogError,
) => Promise<string | undefined | void>;

type Implementation = {
  id: ImplementationId;
  run: ExerciseFunction;
  title: string;
};

const requestDelay = 350;

const implementations: Implementation[] = [
  {
    id: "promise",
    title: "Promise-цепочка",
    run: (...args) => asyncAwaitExercise.promiseFunction(...args),
  },
  {
    id: "async",
    title: "async/await",
    run: (...args) => asyncAwaitExercise.asyncFunction(...args),
  },
];

const scenarios: Scenario[] = [
  {
    id: "success",
    title: "Оба запроса успешны",
    description: "Первый ответ содержит key, поэтому выполняется второй запрос и возвращается key2.",
    responses: {
      one: { key: "access-granted" },
      two: { key2: "Данные из второго ответа" },
    },
  },
  {
    id: "missing-key",
    title: "В первом ответе нет key",
    description: "Создаётся ошибка «No key», второй запрос не выполняется, а ошибка попадает в catch.",
    responses: {
      one: {},
      two: { key2: "Этот ответ не должен быть запрошен" },
    },
  },
  {
    id: "second-request-error",
    title: "Второй запрос завершается ошибкой",
    description: "Первый ответ содержит key, но getJson('two') отклоняет Promise, и ошибка попадает в catch.",
    responses: {
      one: { key: "access-granted" },
      two: new Error("Сервис two недоступен"),
    },
  },
];

function format(value: unknown) {
  if (value instanceof Error) return `Error: ${value.message}`;
  return JSON.stringify(
    value,
    (_key, nestedValue) => nestedValue instanceof Error
      ? `Error: ${nestedValue.message}`
      : nestedValue,
    2,
  ) ?? String(value);
}

function idleRun(): RunState {
  return { events: [], phase: "idle" };
}

function initialRuns(): Record<ScenarioId, Record<ImplementationId, RunState>> {
  return {
    success: { promise: idleRun(), async: idleRun() },
    "missing-key": { promise: idleRun(), async: idleRun() },
    "second-request-error": { promise: idleRun(), async: idleRun() },
  };
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function Result() {
  const [runs, setRuns] = useState(initialRuns);

  const updateRun = (
    scenarioId: ScenarioId,
    implementationId: ImplementationId,
    update: (current: RunState) => RunState,
  ) => {
    setRuns((current) => ({
      ...current,
      [scenarioId]: {
        ...current[scenarioId],
        [implementationId]: update(current[scenarioId][implementationId]),
      },
    }));
  };

  const runScenario = async (
    scenario: Scenario,
    implementation: Implementation,
  ) => {
    updateRun(
      scenario.id,
      implementation.id,
      () => ({ events: [], phase: "running" }),
    );

    const addEvent = (event: string) => {
      updateRun(scenario.id, implementation.id, (current) => ({
        ...current,
        events: [...current.events, event],
      }));
    };

    const getJson: GetJson = async (resource) => {
      addEvent(`Запрос: getJson('${resource}')`);
      await wait(requestDelay);

      const response = scenario.responses[resource];
      if (response instanceof Error) {
        addEvent(`Ошибка запроса: ${response.message}`);
        throw response;
      }

      addEvent(`Ответ: ${format(response)}`);
      return response;
    };

    const logError: LogError = (error) => {
      addEvent(`catch: ${format(error)}`);
    };

    try {
      const result = await implementation.run(getJson, logError);
      updateRun(scenario.id, implementation.id, (current) => ({
        ...current,
        phase: "done",
        result: format(result),
      }));
    } catch (error) {
      addEvent(`Необработанная ошибка: ${format(error)}`);
      updateRun(scenario.id, implementation.id, (current) => ({
        ...current,
        phase: "done",
        result: "Promise отклонён",
      }));
    }
  };

  return (
    <section className="async-preview" aria-label="Проверка async/await">
      <p className="async-preview__intro">
        Каждый сценарий можно отдельно запустить для Promise-цепочки и async/await.
        Журналы показывают порядок запросов, обработку ошибок и итог обеих функций.
      </p>
      <div className="async-preview__scenarios">
        {scenarios.map((scenario) => {
          return (
            <article className="async-scenario" key={scenario.id}>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <details>
                <summary>Показать моки ответов</summary>
                <pre><code>{format(scenario.responses)}</code></pre>
              </details>
              <div className="async-scenario__implementations">
                {implementations.map((implementation) => {
                  const run = runs[scenario.id][implementation.id];

                  return (
                    <section className="async-implementation" key={implementation.id}>
                      <h4>{implementation.title}</h4>
                      <button
                        aria-label={`Запустить ${implementation.title}: ${scenario.title}`}
                        disabled={run.phase === "running"}
                        type="button"
                        onClick={() => void runScenario(scenario, implementation)}
                      >
                        {run.phase === "running" ? "Выполняется…" : "Запустить"}
                      </button>
                      <div
                        aria-label={`Результат ${implementation.title}: ${scenario.title}`}
                        aria-live="polite"
                        className="async-scenario__output"
                        role="status"
                      >
                        <strong>Журнал</strong>
                        {run.events.length === 0 ? (
                          <p>Сценарий ещё не запускался.</p>
                        ) : (
                          <ol>
                            {run.events.map((event, index) => (
                              <li key={`${index}-${event}`}><code>{event}</code></li>
                            ))}
                          </ol>
                        )}
                        {run.phase === "done" && (
                          <p><strong>Результат Promise:</strong> <code>{run.result}</code></p>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
