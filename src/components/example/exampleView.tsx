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
      <div>
        <CodeViewer files={example.files} title={example.title} />
        {example.notes?.map((note) => (
          <p className="example-note" key={note}>
            {note}
          </p>
        ))}
      </div>
      <Result />
    </ResultCodeTable>
  );
}
