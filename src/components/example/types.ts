import type { ComponentType } from "react";

export type SourceLanguage = "css" | "ts" | "tsx";

export interface ExampleSourceFile {
  group?: string;
  path: string;
  language: SourceLanguage;
  source: string;
}

export interface SourceStructureGroup {
  children?: SourceStructureGroup[];
  files: string[];
  label: string;
}

export interface ExampleDefinition {
  id: string;
  title: string;
  entry: ComponentType;
  files: ExampleSourceFile[];
  notes?: string[];
  playground?: {
    entryFile: string;
  };
  sourceStructure?: SourceStructureGroup[];
}
