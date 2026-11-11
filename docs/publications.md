# Publication maintenance

Publications use Astro content collections and build-time Markdown rendering. Article content is written in Polish; this document and the authoring template are in English.

## Article format

Article files are stored in `src/content/publications/`. The [template](templates/publication.md) contains the required frontmatter and an example structure.

| Field | Purpose |
| --- | --- |
| `title`, `description` | Page heading and summary in Polish |
| `slug` | Stable lowercase ASCII URL segment |
| `kind` | `article` for Markdown articles; `guide` for an annual guide |
| `section` | One of `przygotowanie`, `programowanie`, `algorytmika`, `arkusze-kalkulacyjne`, `bazy-danych`, or `teoria` |
| `topics` | Topic IDs from `src/data/task-topics.json` |
| `relatedTasks` | Task collection IDs, matching filenames without `.md` |
| `author` | Author name |
| `publishedAt`, `updatedAt` | Quoted dates in `YYYY-MM-DD` format; the update date cannot precede publication |
| `draft` | Excludes an entry from the publication index, related links, and sitemap when `true` |
| `sources` | Source entries with `title`, absolute `url`, and optional `pages` |

Validation checks topic and task references, dates, and duplicate publication URLs, including in drafts. Annual guides also require a supported `examYear` and matching slug.

## Adding an article

1. Copy the template to `src/content/publications/{slug}.md`.
2. Replace placeholder metadata, dates, and body text. Published content, including headings and alternative text, is in Polish.
3. Add topic and task references and cite the sources used. Distinguish official exam requirements from editorial explanations.
4. Set `draft: false` when the article is ready for publication.
5. Run type checks, a build, and the relevant browser tests.

```bash
npm run check
npm run build
npm exec -- playwright test tests/guide.spec.ts
```

Articles are generated at `/wiedza/{slug}/`. No changes to routing, the index, or sitemap are needed when adding an article. H2 headings populate its table of contents. Fenced code blocks are highlighted during the build. Local illustrations belong in `public/images/` and use `/images/{filename}` URLs with alternative text.

## Updating or withdrawing an article

`updatedAt` records a content change or review, not the build date. Slugs remain stable after publication; a rename requires a hosting redirect to retain the previous URL.

Setting `draft: true` or removing an article excludes its page from the next build. Deployment removes obsolete `index.html` routes under `wiedza/` while preserving hosting configuration and assets. Deployment dry runs report planned removals without applying them.

## Annual guide

The annual guide uses a custom route rather than the Markdown article renderer:

| Path | Responsibility |
| --- | --- |
| `src/content/publications/matura-2027.md` | Publication index and sitemap metadata |
| `src/pages/matura-2027/index.astro` | Guide composition and page metadata |
| `src/data/matura-2027.ts` | Exam facts, source references, and review date |
| `src/data/study-skills.ts` | Skill map and study paths |
| `docs/matura-2027-sources.md` | Source document locations and review scope |

The guide route is generated independently of its publication entry. Setting `draft: true` removes the guide from the index and sitemap but does **not** suppress `/matura-2027/`. Its page title, description, and author are defined in the route, and page dates come from `exam2027.verifiedAt`. Updates to these values must remain consistent with the collection entry.

The validator currently supports the 2027 guide only. A new annual guide requires a route and a corresponding validation change. Guides are excluded from `/wiedza/{slug}/` to avoid duplicate pages.

## Layout and browser behavior

`PublicationLayout` provides metadata, social preview, breadcrumbs, an optional table of contents, navigation, and a footer. The social preview uses `public/images/knowledge-social.png`; the adjacent SVG is its editable source. Article pages add the Markdown body, related tasks, and bibliography.

Articles remain readable without JavaScript. Guide self-assessment is stored locally in the browser and does not affect publication status or article routing.

## Publication lifecycle test

```bash
python3 scripts/test_publications_build.py
```

The test creates temporary published and draft articles, builds the site, and checks routes, highlighting, the index, and sitemap. It also verifies that an invalid task reference fails the build. Cleanup removes the fixtures and rebuilds the normal site.

This test covers Markdown articles, not suppression of the annual guide route. It runs separately from Playwright because both rebuild `dist/`.
