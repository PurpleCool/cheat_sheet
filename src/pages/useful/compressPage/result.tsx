import { useState } from "react";
import compress from "./compress";

type Scenario = {
  expected: string;
  input: number[];
};

const scenarios: Scenario[] = [
  { input: [1, 4, 3, 2], expected: "1-4" },
  { input: [1, 4], expected: "1, 4" },
  { input: [1, 2, 3, 6, 7, 10], expected: "1-3, 6-7, 10" },
  { input: [-3, -2, -1, 2], expected: "-3--1, 2" },
  { input: [1, 1, 2, 3], expected: "1-3" },
  { input: [], expected: "" },
];

export default function Result() {
  const [outputs, setOutputs] = useState<string[] | null>(null);

  const runChecks = () => {
    setOutputs(scenarios.map(({ input }) => String(compress([...input]))));
  };

  return (
    <section className="result" aria-label="Проверка compress">
      <button type="button" onClick={runChecks}>Запустить проверку</button>
      <div aria-live="polite" role="status">
        {outputs === null ? (
          <p>Проверка ещё не запускалась.</p>
        ) : (
          <ol>
            {scenarios.map(({ expected, input }, index) => (
              <li key={JSON.stringify(input)}>
                <code>{`compress(${JSON.stringify(input)})`}</code>
                {" → "}
                <code>{JSON.stringify(outputs[index])}</code>
                {"; ожидается "}
                <code>{JSON.stringify(expected)}</code>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
