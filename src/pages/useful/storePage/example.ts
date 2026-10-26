import type { ExampleDefinition } from "../../../components/example";
import Result from "./result";
import resultSource from "./result.tsx?raw";
import storeSource from "./store.ts?raw";

export const storeExample: ExampleDefinition = {
  id: "store",
  title: "Store",
  entry: Result,
  files: [
    { path: "store.ts", language: "ts", source: storeSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  notes: [
    "Реализуй Store в store.ts: любое присваивание data уведомляет текущих подписчиков, даже если значение не изменилось. Мутации внутри объекта отслеживать не нужно.",
  ],
  playground: { entryFile: "result.tsx" },
};
