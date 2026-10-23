# React Cheat Sheet

Interactive React examples with the exact source files used to render each
result. Every example can also be opened in an editable Sandpack playground.

[See the deployed React Cheat Sheet](https://purplecoolcheatsheet.netlify.app/)

## Requirements

- Node.js 24
- Corepack

The repository pins its Yarn version through the `packageManager` field.

## Development

```shell
corepack yarn install --immutable
corepack yarn dev
```

Vite prints the local development URL when it starts.

## Verification

```shell
corepack yarn typecheck
corepack yarn test
corepack yarn build
```

The production build is written to `dist/`. Netlify settings are versioned in
`netlify.toml`; `public/_redirects` provides the SPA route fallback.

## Bundle analysis

From the repository root, run:

```shell
corepack yarn analyze
```

This builds with the same production mode and environment files as
`corepack yarn build`, then generates a self-contained HTML treemap using
[rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer).
The report is written to `node_modules/.cache/bundle-analysis/stats.html`,
which is ignored by Git and kept outside the deployable `dist/` directory.
The analyzer loads only for this command; regular builds do not generate a report.

Open the HTML file locally in your browser. It does not open automatically.
Alternatively, with Python 3 available, serve it from the repository root:

```shell
python3 -m http.server 8888 --bind 127.0.0.1 --directory node_modules/.cache/bundle-analysis
```

Then visit <http://localhost:8888/stats.html>. The reported module sizes, including
gzip and Brotli sizes, are estimates for comparison, not actual network transfer
sizes or loading times.

## Adding an example

Keep the example as normal type-checked `.ts`, `.tsx`, and `.css` files. Import
those files normally for execution and with Vite's `?raw` suffix for display,
then register both sides in an `ExampleDefinition`. Do not create a separate
string copy of the source. Set `playground.entryFile` to expose the same files
in Sandpack. The playground is loaded only after the user opens it and requires
network access to the CodeSandbox bundler runtime.

## Adding a page

Create a component, for example `src/pages/fetchPage/fetchPage.tsx`, and add
`src/pages/fetchPage/page.ts`:

```ts
import type { PageDefinition } from "../../pageRegistry/types";
import FetchPage from "./fetchPage";

export default {
  title: "Fetch",
  path: "/fetch",
  component: FetchPage,
} satisfies PageDefinition;
```

Only `src/pages/**/page.ts` default exports register pages. `index.ts`, examples,
results, tests and CSS without that exact marker are ignored. The eager Vite
glob in `src/pageRegistry/registry.ts` supplies both routes and header navigation;
no edits to App or Navigation are needed. Sandpack remains loaded on demand.

A directory with a page marker becomes a link. A directory without a marker
but with descendant pages becomes a dropdown, with its directory name used as
the label (`hooks` → `Hooks`). Deeper groups appear as labelled sections in the
same dropdown; all links work with clicks and the keyboard. A directory cannot
have both its own marker and child pages: the registry throws an error naming
that directory. Move the parent page into a separate child directory instead.
Pages and groups are ordered by relative marker path, with IDs derived from the
full directory path.

URLs come from descriptors, independently of folders: the moved hook lessons
keep `/useContext` and `/useRef`. Use absolute static paths with letters, digits,
hyphens or underscores in each segment, without trailing slashes. Duplicate
paths, including case-only differences, are rejected. Exactly one page must use
`/`; it supplies the Home brand link and is omitted from the rest of the menu.
Unknown URLs redirect to `/`.

Page discovery happens in Vite, so production needs a new build to include an
added, moved or removed page. The Fetch example above is an authoring example;
no placeholder Fetch page is shipped.
