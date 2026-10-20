# Zappi API docs

The customer-facing reference for the Zappi API, published at <https://developers.zappi.io>. It's a static [Astro](https://astro.build) site.

## Running it locally

Needs Node 24.

```bash
npm install
npm run dev
```

The dev server runs at <http://localhost:4321>. Search only works in a full build, because the index is generated afterwards:

```bash
npm run build
npm run preview
```

`npm run build` type-checks the project, builds the site into `build/` and indexes it with [Pagefind](https://pagefind.app).

## Where things live

| Path | What it holds |
| --- | --- |
| `src/content/guides/*.md` | Prose sections: introduction, authentication, errors, pagination, etc. |
| `src/data/reference.ts` | The API reference: domains, objects, endpoints, parameters and examples |
| `src/lib/snippets.ts` | Generates each request example in all eight languages |
| `src/components/` | Page building blocks: sidebar, endpoint and object sections, code panels |
| `src/styles/tokens.css` | Zappi design system colours, light and dark |

## Editing the docs

### Guides

Each file in `src/content/guides` is one section. Front matter controls where it appears:

- `order`: lists the guide in the sidebar's top block, in that order. Guides without `order` must be placed in a domain in `src/data/reference.ts` (as Event types and Webhook security are).
- `navLabel`: a shorter sidebar label, if the title is long.
- `examples`: code panels for the right-hand column.

Callouts use directives:

```md
:::warning
Keep your client secret on your server.
:::
```

`note`, `warning` and `tip` are available.

### Endpoints

Endpoints are data in `src/data/reference.ts`, grouped by domain. Each one gives its parameters, the example request and the example response. The request is written once, and the cURL, Node.js, Python, Ruby, PHP, Go, Java and C# samples are generated from it, so they stay consistent.

Field descriptions accept inline Markdown. Link to a section with its id, e.g. `[Order object](#orders-object)`.

Keep the reference in step with the API itself. The request contract is enforced at runtime by `documentation/api_reference.json` in [zappi-api](https://github.com/Intellection/zappi-api), so when an endpoint changes, update both.

## LLM-friendly output

Each section has **Copy for LLM** and **View as Markdown** buttons. The build also publishes:

- `/llms.txt`: an index of every section
- `/llms-full.txt`: the whole reference as one Markdown file
- `/md/<section-id>.txt`: each section on its own

## Deploying

```bash
portctl deploy -a zappi-api-docs -e production -r main
```

The Docker image builds the site with Node and serves `build/` with nginx.
