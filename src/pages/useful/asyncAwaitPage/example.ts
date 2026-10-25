import type { ExampleDefinition } from "../../../components/example";
import asyncAwaitSource from "./asyncAwait.ts?raw";
import previewSource from "./preview.css?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const asyncAwaitExample: ExampleDefinition = {
  id: "async-await",
  title: "async/await",
  entry: Result,
  files: [
    { path: "asyncAwait.ts", language: "ts", source: asyncAwaitSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
    { path: "preview.css", language: "css", source: previewSource },
  ],
  notes: [
    "Сравни promiseFunction и asyncFunction на одинаковых моках и проверь, что их поведение совпадает.",
  ],
  playground: { entryFile: "result.tsx" },
};
