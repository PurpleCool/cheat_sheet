import type { ComponentType } from "react";

export type PageDefinition = {
  title: string;
  path: `/${string}`;
  component: ComponentType;
};

export type RegisteredPage = PageDefinition & { id: string };

export type NavigationItem =
  | { kind: "page"; id: string; title: string; path: string }
  | { kind: "group"; id: string; title: string; children: NavigationItem[] };

export type PageRegistry = {
  home: RegisteredPage;
  pages: RegisteredPage[];
  navigation: NavigationItem[];
};
