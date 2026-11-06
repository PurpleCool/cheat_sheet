import type { ExampleDefinition } from "../../../components/example";
import Result from "./result";
import resultSource from "./result.tsx?raw";
import useHoverSource from "./useHover.ts?raw";

export const useHoverExample: ExampleDefinition = {
  id: "use-hover",
  title: "useHover",
  entry: Result,
  files: [
    { path: "useHover.ts", language: "ts", source: useHoverSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  notes: [
    "Хук возвращает callback ref и признак наведения. При подключении элемента проверяется :hover, затем состояние обновляется по pointerenter и pointerleave.",
    "При замене или удалении элемента подписки предыдущего элемента снимаются. При отключении ref состояние сбрасывается в false.",
  ],
  playground: { entryFile: "result.tsx" },
};
