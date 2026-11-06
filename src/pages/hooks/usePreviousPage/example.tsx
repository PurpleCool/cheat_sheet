import type { ExampleDefinition } from "../../../components/example";
import Result from "./result";
import resultSource from "./result.tsx?raw";
import usePreviousSource from "./usePrevious.ts?raw";

export const usePreviousExample: ExampleDefinition = {
  id: "use-previous",
  title: "usePrevious",
  entry: Result,
  files: [
    { path: "usePrevious.ts", language: "ts", source: usePreviousSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  exercise: {
    sourceUrl: "https://bigfrontend.dev/react/usePrevious",
    sourceLabel: "Источник: BFE.dev — usePrevious",
    statement: (
      <div lang="en">
        <p>
          Create a hook <code>usePrevious()</code> to return the previous value,
          with initial previous value of <code>undefined</code>.
        </p>
      </div>
    ),
  },
  playground: { entryFile: "result.tsx" },
};
