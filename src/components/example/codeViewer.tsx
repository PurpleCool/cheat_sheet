import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";
import type { ExampleSourceFile } from "./types";
import "./example.css";

interface CodeViewerProps {
  files: ExampleSourceFile[];
  headingId?: string;
  title: string;
}

export default function CodeViewer({ files, headingId, title }: CodeViewerProps) {
  const [activePath, setActivePath] = useState(files[0].path);
  const tabsId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const codeRef = useRef<HTMLElement>(null);
  const activeFile =
    files.find(({ path }) => path === activePath) ?? files[0];
  const activeIndex = files.indexOf(activeFile);
  const activeTabId = `${tabsId}-tab-${activeIndex}`;
  const panelId = `${tabsId}-panel`;
  const fileGroups = files.reduce<
    Array<{ files: Array<{ file: ExampleSourceFile; index: number }>; label?: string }>
  >((groups, file, index) => {
    const previousGroup = groups.at(-1);

    if (previousGroup && previousGroup.label === file.group) {
      previousGroup.files.push({ file, index });
    } else {
      groups.push({ label: file.group, files: [{ file, index }] });
    }

    return groups;
  }, []);

  const selectTab = (index: number) => {
    setActivePath(files[index].path);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowLeft":
        nextIndex = (index - 1 + files.length) % files.length;
        break;
      case "ArrowRight":
        nextIndex = (index + 1) % files.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = files.length - 1;
        break;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      selectTab(nextIndex);
    }
  };

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [activeFile]);

  return (
    <section className="code" aria-label={`${title} source code`}>
      <h2 className="subheader" id={headingId}>
        {title}
      </h2>
      {files.length > 1 && (
        <div className="code-tabs" role="tablist" aria-label="Source files">
          {fileGroups.map((group, groupIndex) => (
            <div className="code-tab-group" key={group.label ?? groupIndex} role="presentation">
              {group.label && <span className="code-tab-group-label">{group.label}</span>}
              <div className="code-tab-group-buttons" role="presentation">
                {group.files.map(({ file: { path }, index }) => (
                  <button
                    aria-controls={panelId}
                    aria-selected={path === activeFile.path}
                    className="code-tab"
                    id={`${tabsId}-tab-${index}`}
                    key={path}
                    onClick={() => setActivePath(path)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    role="tab"
                    tabIndex={path === activeFile.path ? 0 : -1}
                    type="button"
                  >
                    {path}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <pre
        aria-labelledby={files.length > 1 ? activeTabId : undefined}
        id={files.length > 1 ? panelId : undefined}
        role={files.length > 1 ? "tabpanel" : undefined}
        tabIndex={files.length > 1 ? 0 : undefined}
      >
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
