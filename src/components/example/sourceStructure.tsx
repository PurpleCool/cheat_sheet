import type { SourceStructureGroup } from "./types";

interface SourceStructureProps {
  groups: SourceStructureGroup[];
}

function StructureGroup({ group }: { group: SourceStructureGroup }) {
  return (
    <li className="source-structure-item">
      <div className="source-structure-node">
        <strong>{group.label}</strong>
        <ul aria-label={`${group.label} files`} className="source-file-list">
          {group.files.map((file) => (
            <li key={file}>
              <code>{file}</code>
            </li>
          ))}
        </ul>
      </div>
      {group.children && (
        <ul className="source-structure-children">
          {group.children.map((child) => (
            <StructureGroup group={child} key={child.label} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SourceStructure({ groups }: SourceStructureProps) {
  return (
    <figure className="source-structure">
      <figcaption>Suggested project structure</figcaption>
      <ul className="source-structure-roots">
        {groups.map((group) => (
          <StructureGroup group={group} key={group.label} />
        ))}
      </ul>
    </figure>
  );
}
