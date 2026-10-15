import type { ExampleDefinition } from "../../components/example";
import ClassContextComponentSource from "./result/classContextComponent.tsx?raw";
import ContextParentSource from "./result/contextParent.tsx?raw";
import FunctionContextComponentSource from "./result/functionContextComponent.tsx?raw";
import ResultStylesSource from "./result/result.css?raw";
import ResultSource from "./result/result.tsx?raw";
import ThemeContextSource from "./result/themeContext.ts?raw";
import { Result } from "./result";

export const useContextExample: ExampleDefinition = {
  id: "use-context-theme",
  title: "Sharing theme state with useContext",
  entry: Result,
  files: [
    {
      group: "utils",
      path: "themeContext.ts",
      language: "ts",
      source: ThemeContextSource,
    },
    {
      group: "parent",
      path: "contextParent.tsx",
      language: "tsx",
      source: ContextParentSource,
    },
    {
      group: "children",
      path: "functionContextComponent.tsx",
      language: "tsx",
      source: FunctionContextComponentSource,
    },
    {
      group: "children",
      path: "classContextComponent.tsx",
      language: "tsx",
      source: ClassContextComponentSource,
    },
    {
      group: "root",
      path: "result.tsx",
      language: "tsx",
      source: ResultSource,
    },
    {
      group: "root",
      path: "result.css",
      language: "css",
      source: ResultStylesSource,
    },
  ],
  playground: {
    entryFile: "result.tsx",
  },
  sourceStructure: [
    {
      label: "root",
      files: ["result.tsx", "result.css"],
      children: [
        {
          label: "parent",
          files: ["contextParent.tsx"],
          children: [
            {
              label: "children",
              files: [
                "functionContextComponent.tsx",
                "classContextComponent.tsx",
              ],
            },
          ],
        },
      ],
    },
    {
      label: "utils",
      files: ["themeContext.ts"],
    },
  ],
};
