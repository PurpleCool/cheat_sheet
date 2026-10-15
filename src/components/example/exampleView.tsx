import { ResultCodeTable } from "../../layout/resultCodeTable";
import CodeViewer from "./codeViewer";
import type { ExampleDefinition } from "./types";

interface ExampleViewProps {
  example: ExampleDefinition;
}

export default function ExampleView({ example }: ExampleViewProps) {
  const Result = example.entry;

  return (
    <ResultCodeTable>
      <CodeViewer files={example.files} title={example.title} />
      <Result />
    </ResultCodeTable>
  );
}
