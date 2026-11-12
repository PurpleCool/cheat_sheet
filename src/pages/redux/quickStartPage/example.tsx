import type { ExampleDefinition } from "../../../components/example";
import { dependencies } from "../../../../package.json";
import storeSource from "./app/store.ts?raw";
import hooksSource from "./app/hooks.ts?raw";
import counterSliceSource from "./features/counter/counterSlice.ts?raw";
import counterSource from "./features/counter/Counter.tsx?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const quickStartExample: ExampleDefinition = {
  id: "redux-quick-start",
  title: "Quick Start",
  entry: Result,
  files: [
    { path: "app/store.ts", language: "ts", source: storeSource },
    { path: "app/hooks.ts", language: "ts", source: hooksSource },
    { path: "features/counter/counterSlice.ts", language: "ts", source: counterSliceSource },
    { path: "features/counter/Counter.tsx", language: "tsx", source: counterSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  sourceStructure: [
    { label: "app", files: ["app/store.ts", "app/hooks.ts"] },
    { label: "features/counter", files: ["features/counter/counterSlice.ts", "features/counter/Counter.tsx"] },
    { label: "Запуск", files: ["result.tsx"] },
  ],
  exercise: {
    sourceUrl: "https://redux.js.org/tutorials/quick-start",
    sourceLabel: "Redux — Quick Start",
    statement: (
      <p>Пройди руководство самостоятельно, затем поэкспериментируй с собственными действиями и состоянием счётчика.</p>
    ),
  },
  notes: [
    "Зависимости Redux Toolkit и React-Redux уже установлены. Файлы app/store.ts, app/hooks.ts и features/counter/counterSlice.ts подготовлены для твоего кода; Counter.tsx — место для интерфейса счётчика.",
    "result.tsx запускает пример на этой странице. Здесь можно подключить Provider вместо main.tsx из руководства. Область результата пока пуста — она отобразит твой Counter.",
  ],
  playground: {
    entryFile: "result.tsx",
    dependencies: {
      "@reduxjs/toolkit": dependencies["@reduxjs/toolkit"],
      "react-redux": dependencies["react-redux"],
    },
  },
};
