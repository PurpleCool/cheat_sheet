import type { ExampleDefinition } from "../../../components/example";
import flattenMenuSource from "./flattenMenu.ts?raw";
import scenariosSource from "./scenarios.ts?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const flattenMenuExample: ExampleDefinition = {
  id: "flattenMenu",
  title: "flattenMenu",
  entry: Result,
  files: [
    { path: "flattenMenu.ts", language: "ts", source: flattenMenuSource },
    { path: "scenarios.ts", language: "ts", source: scenariosSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  notes: ["Реализуй flattenMenu в flattenMenu.ts. Кнопка проверки показывает фактический и ожидаемый результат каждого сценария, а также проверяет неизменность входных данных."],
  playground: { entryFile: "result.tsx" },
};
