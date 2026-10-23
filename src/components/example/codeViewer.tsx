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
import SourceStructure from "./sourceStructure";
import type { ExampleSourceFile, SourceStructureGroup } from "./types";
import "./example.css";

interface CodeViewerProps {
  files: ExampleSourceFile[];
  headingId?: string;
  sourceStructure?: SourceStructureGroup[];
  title: string;
}

export default function CodeViewer({
  files,
  headingId,
  sourceStructure,
  title,
}: CodeViewerProps) {
  const [activePath, setActivePath] = useState(files[0].path);
  const tabsId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const codeRef = useRef<HTMLElement>(null);
  const activeFile =
    files.find(({ path }) => path === activePath) ?? files[0];
  const activeIndex = files.indexOf(activeFile);
  const activeTabId = `${tabsId}-tab-${activeIndex}`;
  const panelId = `${tabsId}-panel`;
  const selectTab = (index: number) => {
    setActivePath(files[index].path);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const tabList = event.currentTarget.closest('[role="tablist"]');
    if (!tabList) return;

    const tabs = Array.from(
      tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const index = tabs.indexOf(event.currentTarget);
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowLeft":
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      selectTab(tabRefs.current.indexOf(tabs[nextIndex]));
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
      {sourceStructure ? (
        <SourceStructure
          activePath={activeFile.path}
          filePaths={files.map(({ path }) => path)}
          groups={sourceStructure}
          onKeyDown={handleTabKeyDown}
          onSelect={selectTab}
          panelId={panelId}
          registerTab={(index, element) => {
            tabRefs.current[index] = element;
          }}
          tabsId={tabsId}
        />
      ) : files.length > 1 ? (
        <div className="code-tabs" role="tablist" aria-label="Source files">
          {files.map(({ path }, index) => (
            <button
              aria-controls={panelId}
              aria-selected={path === activeFile.path}
              className="code-tab"
              id={`${tabsId}-tab-${index}`}
              key={path}
              onClick={() => selectTab(index)}
              onKeyDown={handleTabKeyDown}
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
      ) : null}
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
