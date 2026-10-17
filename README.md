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
