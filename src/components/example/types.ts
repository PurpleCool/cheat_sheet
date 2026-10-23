import type { ComponentType, ReactNode } from "react";

export type SourceLanguage = "css" | "ts" | "tsx";

export interface ExampleSourceFile {
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
  exercise?: {
    sourceUrl: string;
    sourceLabel: string;
    statement: ReactNode;
  };
  notes?: string[];
  playground?: {
    entryFile: string;
  };
  sourceStructure?: SourceStructureGroup[];
}
