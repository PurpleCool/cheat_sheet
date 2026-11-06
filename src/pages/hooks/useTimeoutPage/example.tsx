import type { ExampleDefinition } from "../../../components/example";
import Result from "./result";
import resultSource from "./result.tsx?raw";
import useTimeoutSource from "./useTimeout.ts?raw";

export const useTimeoutExample: ExampleDefinition = {
  id: "use-timeout",
  title: "useTimeout",
  entry: Result,
  files: [
    { path: "useTimeout.ts", language: "ts", source: useTimeoutSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  exercise: {
    sourceUrl: "https://bigfrontend.dev/react/usetimeout",
    sourceLabel: "Источник: BFE.dev — useTimeout",
    statement: (
      <div lang="en">
        <p>Create a hook to easily use <code>setTimeout(callback, delay)</code>.</p>
        <ol>
          <li>reset the timer if delay changes</li>
          <li>DO NOT reset the timer if only callback changes</li>
        </ol>
      </div>
    ),
  },
  playground: { entryFile: "result.tsx" },
};
