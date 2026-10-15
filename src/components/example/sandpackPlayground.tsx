import {
  Sandpack,
  type SandpackFiles,
} from "@codesandbox/sandpack-react";
import type { ExampleDefinition } from "./types";

interface SandpackPlaygroundProps {
  example: ExampleDefinition;
}

export default function SandpackPlayground({
  example,
}: SandpackPlaygroundProps) {
  if (!example.playground) {
    return null;
  }

  const files = example.files.reduce<SandpackFiles>(
    (sandboxFiles, file) => {
      const path =
        file.path === example.playground?.entryFile
          ? "/App.tsx"
          : `/${file.path}`;

      sandboxFiles[path] = file.source;
      return sandboxFiles;
    },
    {},
  );

  return (
    <Sandpack
      customSetup={{
        dependencies: {
          react: "19.3.1",
          "react-dom": "19.3.1",
        },
      }}
      files={files}
      options={{
        editorHeight: 520,
        showConsoleButton: true,
        showRefreshButton: true,
        showTabs: true,
      }}
      template="react-ts"
      theme="light"
    />
  );
}
