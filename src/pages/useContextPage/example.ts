import type { ExampleDefinition } from "../../components/example";
import ClassContextComponentSource from "./result/classContextComponent.tsx?raw";
import ContextParentSource from "./result/contextParent.tsx?raw";
import FunctionContextComponentSource from "./result/functionContextComponent.tsx?raw";
import ResultStylesSource from "./result/result.css?raw";
import ThemeContextSource from "./result/themeContext.ts?raw";
import { Result } from "./result";

export const useContextExample: ExampleDefinition = {
  id: "use-context-theme",
  title: "Sharing theme state with useContext",
  entry: Result,
  files: [
    {
      path: "themeContext.ts",
      language: "ts",
      source: ThemeContextSource,
    },
    {
      path: "contextParent.tsx",
      language: "tsx",
      source: ContextParentSource,
    },
    {
      path: "functionContextComponent.tsx",
      language: "tsx",
      source: FunctionContextComponentSource,
    },
    {
      path: "classContextComponent.tsx",
      language: "tsx",
      source: ClassContextComponentSource,
    },
    {
      path: "result.css",
      language: "css",
      source: ResultStylesSource,
    },
  ],
};
