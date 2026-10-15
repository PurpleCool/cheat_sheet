import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";
import type { ExampleSourceFile } from "./types";
import "./example.css";

interface CodeViewerProps {
  files: ExampleSourceFile[];
  title: string;
}

export default function CodeViewer({ files, title }: CodeViewerProps) {
  const [activePath, setActivePath] = useState(files[0].path);
  const codeRef = useRef<HTMLElement>(null);
  const activeFile =
    files.find(({ path }) => path === activePath) ?? files[0];

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [activeFile]);

  return (
    <section className="code" aria-label={`${title} source code`}>
      <h2 className="subheader">{title}</h2>
      {files.length > 1 && (
        <div className="code-tabs" role="tablist" aria-label="Source files">
          {files.map(({ path }) => (
            <button
              aria-selected={path === activeFile.path}
              className="code-tab"
              key={path}
              onClick={() => setActivePath(path)}
              role="tab"
              type="button"
            >
              {path}
            </button>
          ))}
        </div>
      )}
      <pre>
        <code
          className={`language-${activeFile.language}`}
          data-source-path={activeFile.path}
          ref={codeRef}
        >
          {activeFile.source}
        </code>
      </pre>
    </section>
  );
}
