import type { ComponentType } from "react";

export type SourceLanguage = "css" | "ts" | "tsx";

export interface ExampleSourceFile {
  path: string;
  language: SourceLanguage;
  source: string;
}

export interface ExampleDefinition {
  id: string;
  title: string;
  entry: ComponentType;
  files: ExampleSourceFile[];
  notes?: string[];
}
