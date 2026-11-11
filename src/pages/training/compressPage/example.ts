import type { ExampleDefinition } from "../../../components/example";
import compressSource from "./compress.ts?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

export const compressExample: ExampleDefinition = {
  id: "compress",
  title: "compress",
  entry: Result,
  files: [
    { path: "compress.ts", language: "ts", source: compressSource },
    { path: "result.tsx", language: "tsx", source: resultSource },
  ],
  notes: [
    "Объедини последовательные целые числа в диапазоны. Порядок входных чисел произвольный, дубликаты нужно игнорировать; массив может быть пустым и содержать отрицательные числа.",
  ],
  playground: { entryFile: "result.tsx" },
};
