import type { ExampleDefinition } from "../../../components/example";
import fetchWithRetriesSource from "./fetchWithRetries.ts?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const fetchWithRetriesExample: ExampleDefinition = {
  id: "fetch-with-retries",
  title: "fetchWithRetries",
  entry: Result,
  files: [
    { path: "fetchWithRetries.ts", language: "ts", source: fetchWithRetriesSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  notes: ["Пиши решение в fetchWithRetries.ts, а код запуска — в result.tsx."],
  playground: { entryFile: "result.tsx" },
};
