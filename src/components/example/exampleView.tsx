import { lazy, Suspense, useState } from "react";
import { ResultCodeTable } from "../../layout/resultCodeTable";
import CodeViewer from "./codeViewer";
import type { ExampleDefinition } from "./types";

interface ExampleViewProps {
  example: ExampleDefinition;
}

// TODO: Profile the first playground opening on slow networks and devices
// before deciding how to optimize the large Sandpack chunk.
const SandpackPlayground = lazy(() => import("./sandpackPlayground"));

export default function ExampleView({ example }: ExampleViewProps) {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const Result = example.entry;

  return (
    <section className="example" aria-labelledby={`${example.id}-title`}>
      {example.exercise && (
        <div className="example-note">
          <p>
            <a
              href={example.exercise.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {example.exercise.sourceLabel}
            </a>
          </p>
          <details>
            <summary>Условие задачи</summary>
            {example.exercise.statement}
          </details>
        </div>
      )}
      <ResultCodeTable>
        <div>
          <CodeViewer
            files={example.files}
            headingId={`${example.id}-title`}
            sourceStructure={example.sourceStructure}
            title={example.title}
          />
          {example.notes?.map((note) => (
            <p className="example-note" key={note}>
              {note}
            </p>
          ))}
        </div>
        <Result />
      </ResultCodeTable>
      {example.playground && (
        <div className="playground">
          <button
            aria-expanded={isPlaygroundOpen}
            className="playground-toggle"
            onClick={() => setIsPlaygroundOpen((isOpen) => !isOpen)}
            type="button"
          >
            {isPlaygroundOpen ? "Close playground" : "Edit in playground"}
          </button>
          {isPlaygroundOpen && (
            <Suspense fallback={<p>Loading playground…</p>}>
              <SandpackPlayground example={example} />
            </Suspense>
          )}
        </div>
      )}
    </section>
  );
}
