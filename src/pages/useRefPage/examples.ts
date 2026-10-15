import type { ExampleDefinition } from "../../components/example";
import RenderCountResult from "./example-1/result/result";
import RenderCountSource from "./example-1/result/result.tsx?raw";
import PreviousValueResult from "./example-2/result/result";
import PreviousValueSource from "./example-2/result/result.tsx?raw";
import InputFocusResult from "./example-3/result/result";
import InputFocusSource from "./example-3/result/result.tsx?raw";

export const useRefExamples: ExampleDefinition[] = [
  {
    id: "render-count",
    title: "Counting renders with useRef",
    entry: RenderCountResult,
    files: [
      { path: "result.tsx", language: "tsx", source: RenderCountSource },
    ],
  },
  {
    id: "previous-value",
    title: "Reading the previous value with useRef",
    entry: PreviousValueResult,
    files: [
      { path: "result.tsx", language: "tsx", source: PreviousValueSource },
    ],
  },
  {
    id: "input-focus",
    title: "Focusing an input with useRef",
    entry: InputFocusResult,
    files: [
      { path: "result.tsx", language: "tsx", source: InputFocusSource },
    ],
  },
];
