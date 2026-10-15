import type { KeyboardEvent } from "react";
import type { SourceStructureGroup } from "./types";

interface SourceStructureProps {
  activePath: string;
  filePaths: string[];
  groups: SourceStructureGroup[];
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onSelect: (index: number) => void;
  panelId: string;
  registerTab: (index: number, element: HTMLButtonElement | null) => void;
  tabsId: string;
}

type StructureGroupProps = Omit<SourceStructureProps, "groups"> & {
  group: SourceStructureGroup;
};

function StructureGroup({
  activePath,
  filePaths,
  group,
  onKeyDown,
  onSelect,
  panelId,
  registerTab,
  tabsId,
}: StructureGroupProps) {
  return (
    <div className="source-structure-item" role="presentation">
      <div className="source-structure-node" role="presentation">
        <strong>{group.label}</strong>
        <div className="source-file-list" role="presentation">
          {group.files.map((file) => {
            const index = filePaths.indexOf(file);

            return (
              <button
                aria-controls={panelId}
                aria-selected={file === activePath}
                className="source-file-button"
                id={`${tabsId}-tab-${index}`}
                key={file}
                onClick={() => onSelect(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                ref={(element) => registerTab(index, element)}
                role="tab"
                tabIndex={file === activePath ? 0 : -1}
                type="button"
              >
                {file}
              </button>
            );
          })}
        </div>
      </div>
      {group.children && (
        <div className="source-structure-children" role="presentation">
          {group.children.map((child) => (
            <StructureGroup
              activePath={activePath}
              filePaths={filePaths}
              group={child}
              key={child.label}
              onKeyDown={onKeyDown}
              onSelect={onSelect}
              panelId={panelId}
              registerTab={registerTab}
              tabsId={tabsId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SourceStructure(props: SourceStructureProps) {
  return (
    <figure className="source-structure">
      <figcaption>Suggested project structure</figcaption>
      <div
        aria-label="Source files"
        className="source-structure-roots"
        role="tablist"
      >
        {props.groups.map((group) => (
          <StructureGroup {...props} group={group} key={group.label} />
        ))}
      </div>
    </figure>
  );
}
