import type { ExampleDefinition } from "../../../components/example";
import Result from "./result";
import resultSource from "./result.tsx?raw";
import useIsFirstRenderSource from "./useIsFirstRender.ts?raw";

export const useIsFirstRenderExample: ExampleDefinition = {
  id: "use-is-first-render",
  title: "useIsFirstRender",
  entry: Result,
  files: [
    { path: "useIsFirstRender.ts", language: "ts", source: useIsFirstRenderSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  exercise: {
    sourceUrl: "https://bigfrontend.dev/react/useIsFirstRender",
    sourceLabel: "Источник: BFE.dev — useIsFirstRender",
    statement: (
      <div lang="en">
        <p>Create a hook to tell if it is the first render.</p>
        <p>Return <code>true</code> initially and <code>false</code> on subsequent renders.</p>
      </div>
    ),
  },
  playground: { entryFile: "result.tsx" },
};
