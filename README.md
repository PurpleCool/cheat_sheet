# React Cheat Sheet

Interactive React examples with the exact source files used to render each
result.

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

## Adding an example

Keep the example as normal type-checked `.ts`, `.tsx`, and `.css` files. Import
those files normally for execution and with Vite's `?raw` suffix for display,
then register both sides in an `ExampleDefinition`. Do not create a separate
string copy of the source.
