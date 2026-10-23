import type {
  NavigationItem,
  PageDefinition,
  PageRegistry,
  RegisteredPage,
} from "./types";

type Directory = {
  id: string;
  title: string;
  page?: RegisteredPage;
  children: Map<string, Directory>;
};

function groupTitle(directory: string) {
  if (directory === "ui") return "UI";

  const words = directory
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function navigationFor(directory: Directory): NavigationItem[] {
  if (directory.page) {
    if (directory.children.size > 0) {
      throw new Error(
        `Page directory "${directory.id}" has both page.ts and child pages. Move its page into a separate child directory.`,
      );
    }
    const { id, title, path } = directory.page;
    return path === "/" ? [] : [{ kind: "page", id, title, path }];
  }

  const children = [...directory.children.values()].flatMap(navigationFor);
  return children.length > 0
    ? [{
        kind: "group",
        id: `group:${directory.id}`,
        title: directory.title,
        children,
      }]
    : [];
}

// Keys use the same paths as registry.ts's Vite glob, relative to that module.
export function buildPageRegistry(
  modules: Record<string, PageDefinition>,
): PageRegistry {
  const root: Directory = { id: ".", title: "", children: new Map() };
  const pages: RegisteredPage[] = [];
  const pathOwners = new Map<string, string>();

  for (const file of Object.keys(modules).sort()) {
    const match = /^\.\.\/pages\/(?:(.+)\/)?page\.ts$/.exec(file);
    if (!match) continue;

    const definition = modules[file];
    // Keep paths literal and unambiguous for both React Router and header links.
    if (!/^\/(?:[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*)?$/.test(definition.path)) {
      throw new Error(
        `Invalid page path "${definition.path}" in ${file}. Use an absolute static URL with letters, digits, hyphens or underscores in each segment, without a trailing slash.`,
      );
    }
    const pathKey = definition.path.toLowerCase();
    const owner = pathOwners.get(pathKey);
    if (owner) {
      throw new Error(
        `Conflicting page path "${definition.path}": ${owner} and ${file}. Paths must be unique (case-insensitive).`,
      );
    }
    pathOwners.set(pathKey, file);

    const directory = match[1] ?? "";
    const page: RegisteredPage = { ...definition, id: `page:${directory || "."}` };
    pages.push(page);

    let node = root;
    const segments = directory ? directory.split("/") : [];
    for (const [index, segment] of segments.entries()) {
      let child = node.children.get(segment);
      if (!child) {
        child = {
          id: segments.slice(0, index + 1).join("/"),
          title: groupTitle(segment),
          children: new Map(),
        };
        node.children.set(segment, child);
      }
      node = child;
    }
    node.page = page;
  }

  const home = pages.find(({ path }) => path === "/");
  if (!home) throw new Error('Page registry requires a home page with path "/".');

  // Validate the root too, so a root page.ts cannot silently hide descendants.
  const navigation = root.page
    ? navigationFor(root)
    : [...root.children.values()].flatMap(navigationFor);
  return { home, pages, navigation };
}
