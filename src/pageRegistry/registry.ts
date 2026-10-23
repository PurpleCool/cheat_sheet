import { buildPageRegistry } from "./buildPageRegistry";
import type { PageDefinition } from "./types";

export const pageModules = import.meta.glob<PageDefinition>(
  "../pages/**/page.ts",
  { eager: true, import: "default" },
);

export const pageRegistry = buildPageRegistry(pageModules);
