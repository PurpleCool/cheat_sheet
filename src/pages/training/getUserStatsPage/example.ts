import type { ExampleDefinition } from "../../../components/example";
import getUserStatsSource from "./getUserStats.ts?raw";
import scenariosSource from "./scenarios.ts?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const getUserStatsExample: ExampleDefinition = {
  id: "getUserStats",
  title: "getUserStats",
  entry: Result,
  files: [
    { path: "getUserStats.ts", language: "ts", source: getUserStatsSource },
    { path: "scenarios.ts", language: "ts", source: scenariosSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  playground: { entryFile: "result.tsx" },
};
