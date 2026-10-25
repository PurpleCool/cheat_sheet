import type { ExampleDefinition } from "../../../components/example";
import previewSource from "./preview.css?raw";
import reduceSource from "./reduce.ts?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const reduceExample: ExampleDefinition = {
  id: "reduce",
  title: "reduce",
  entry: Result,
  files: [
    { path: "reduce.ts", language: "ts", source: reduceSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
    { path: "preview.css", language: "css", source: previewSource },
  ],
  notes: ["Типизируй реализацию в reduce.ts, а сценарии проверки запускай справа."],
  playground: { entryFile: "result.tsx" },
};
