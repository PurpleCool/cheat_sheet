import type { ExampleDefinition } from "../../../components/example";
import Result from "./result";
import resultSource from "./result.tsx?raw";
import useThrottleWithLeadingSource from "./useThrottleWithLeading.ts?raw";

export const useThrottleWithLeadingExample: ExampleDefinition = {
  id: "use-throttle-with-leading",
  title: "useThrottleWithLeading",
  entry: Result,
  files: [
    { path: "useThrottleWithLeading.ts", language: "ts", source: useThrottleWithLeadingSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  notes: [
    "Авторский алгоритм сохранён. Первое изменение проходит сразу; во время ожидания запоминается последнее значение, которое выводится по окончании delay.",
    "После отложенного обновления таймер освобождается: следующее изменение может пройти сразу, даже через 1 мс. Минимальный интервал delay между всеми обновлениями не гарантируется.",
    "Изменение delay не перезапускает активный таймер. Новая задержка применяется к следующему таймеру.",
  ],
  playground: { entryFile: "result.tsx" },
};
