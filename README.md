# Computer science Matura preparation

Website for Igor Józefowicz's computer science Matura tutoring, built with Astro, React, TypeScript, and custom CSS. Astro generates static HTML, optimized images, and metadata. React powers the interactive lesson examples and homepage sections.

The site includes an exam archive (`/arkusze/`), a task catalog (`/zadania/`), a study guide (`/matura-2027/`), and a knowledge section (`/wiedza/`). Exam papers, marking guidelines, and task data are stored locally. Booking uses an embedded Google Calendar appointment page. The site has no custom backend or analytics.

## Development

Requirements: Node.js 22.12 or newer (see `engines` in `package.json`), npm, and Python 3.10 or newer. Build validation uses the Python standard library.

```bash
npm ci
npm run dev
```

The development server runs at `http://127.0.0.1:4321`.

On WSL, `bash scripts/npm.sh` prefers the checkout-local Linux runtime in `.tools/node/` when available and rejects Windows npm installations:

```bash
bash scripts/npm.sh ci
bash scripts/npm.sh run dev
```

### Docker

```bash
docker compose up --build -d
docker compose logs --tail=50 web
docker compose down
```

Nginx serves the static build at `http://localhost:4321`, bound to the local interface. Source changes require rebuilding the image.

## Checks and tests

```bash
npm run check
npm run exams:test
python3 -m unittest discover -s scripts -p 'test_deploy_pages.py'
npm run build
npm run preview
```

The build output is `dist/`. Static hosting requires its entire contents, including `_astro/` and downloads.

Browser tests use Playwright and Chromium:

```bash
npx playwright install --with-deps chromium
npm test
npm run test:dev
```

`npm test` builds the site and starts a preview server on port 4322. Tests cover content, metadata, interactive lessons, archive filtering and downloads, responsive layouts, keyboard access, reduced motion, and behavior without JavaScript. Google Calendar requests are stubbed; the tests do not create bookings or check live availability. Failure traces and screenshots are saved in `test-results/`.

`npm run test:dev` starts a separate development server on port 4323 and checks homepage hydration and the mobile menu before and after running `check` and `build`. Astro uses separate Vite caches for development, synchronization, builds, and previews. Results are saved in `test-results-dev/`.

The browser suites run sequentially because both rebuild `dist/`.

## Project structure

| Path | Contents |
| --- | --- |
| `src/pages/` | Astro routes and sitemap |
| `src/components/` | Astro components and React sections |
| `src/data/site.ts` | Homepage content, prices, contact details, and booking configuration |
| `src/data/exams.json` | Exam archive data |
| `src/data/exam-sources.json` | Exam source inventory |
| `src/build/` | Image preparation and syntax highlighting |
| `src/hooks/` | React hooks for section effects |
| `src/scripts/` | Browser interactions and algorithm traces |
| `src/styles/` | Site styles and responsive layouts |
| `public/pliki/matury/` | Exam papers, marking guidelines, and task data |
| `images/` | Original artwork |
| `scripts/` | Validation, asset generation, and deployment tools |
| `tests/` | Playwright tests |

Student-facing content is in Polish. Public URLs, anchors, and query parameters retain their Polish names.

### Exam archive

The [archive maintenance guide](docs/exam-archive.md) covers imports, ZIP generation, and validation. The [import report](docs/exam-import-report.json) records available files and missing materials; the [source audit](docs/exam-source-audit.json) tracks collection gaps. The archive is not a complete historical collection of CKE materials.

### Homepage and lesson examples

`src/pages/index.astro` composes the homepage. Header and hero components hydrate on load; interactive sections hydrate near the viewport. Static content remains available without JavaScript.

Lesson examples demonstrate counting even numbers, Kadane's algorithm, and longest increasing subsequence length. `src/scripts/lesson-trace.ts` generates execution snapshots from fixed example data; the browser does not execute Python. Shiki highlights code during the build. Changes to example code require corresponding updates to trace line numbers.

Section effects respect reduced motion and release observers, listeners, and timers on unmount. `npm run report:bundle` reports JavaScript bundle sizes from `dist/_astro/`.

### Booking

`introMeeting.bookingUrl` in `src/data/site.ts` contains the complete iframe URL for a Google Calendar appointment schedule. An empty value switches the booking section to email contact; an invalid URL fails the build.

The booking section at `#rezerwacja` includes the appointment description, a lazy-loaded iframe, a direct booking link, and contact details. Availability, time zones, meeting links, and confirmations are configured in Google Calendar.

### Assets

Astro generates responsive image variants from local artwork. Asset generation commands:

```bash
node scripts/social-image.mjs
node scripts/brand-assets.mjs
npm run build
```

The social image script prepares the portrait preview. The brand script generates the header logo, PNG favicons, and `public/favicon.ico`. The production URL is configured in `astro.config.mjs` and used for canonical and social metadata.

## Deployment

`.github/workflows/deploy.yml` runs checks, validator tests, browser tests, and the development-server regression test before transferring `dist/` to Hostinger over SSH with rsync.

- Pushes to `master` deploy automatically after checks pass.
- Pull requests targeting `master` run checks without deployment secrets.
- Manual runs on `master` support deployment and a `dry_run` option. Other branches run checks only.
- Deployment jobs are serialized.

### Repository secrets

| Secret | Value |
| --- | --- |
| `HOSTINGER_HOST` | SSH hostname or IP address |
| `HOSTINGER_PORT` | SSH port from hPanel |
| `HOSTINGER_USER` | SSH username |
| `HOSTINGER_PATH` | Existing writable website directory |
| `HOSTINGER_SSH_KEY` | Complete private key without a passphrase; the matching public key must be registered in hPanel |
| `HOSTINGER_KNOWN_HOSTS` | Full `known_hosts` entry for the host and port, verified against the fingerprint in hPanel |

SSH access must be enabled on the hosting account. Deployment requires SSH and rsync; Docker is not used on the server.

### Publication and route cleanup

`scripts/deploy-hostinger.sh` uploads assets and downloads before publishing HTML. `scripts/sync-hostinger-pages.sh` then removes obsolete `index.html` routes under `arkusze/`, `zadania/`, `wiedza/`, and `matura-2027/`. The namespace list defines which routes the deployment owns. Other filenames, hosting configuration, downloads, and older hashed assets are preserved.

The cleanup handles withdrawn pages and renamed routes, including pages from earlier deployments. Retaining an old URL after a rename requires a hosting redirect. Cleanup tests use real rsync against temporary directories.

For local deployment, the script reads the same environment variables as the workflow:

```bash
DEPLOY_DRY_RUN=true bash scripts/deploy-hostinger.sh
```

A dry run reports transfers and removals without changing hosted files. Deployment overwrites matching files and removes withdrawn routes; it does not create a backup or atomically replace the hosting directory.

## Task catalog and practice

`/zadania/` contains 154 subtasks from seven Formula 2023 exam sets, organized by topic and difficulty. Each task includes its instructions, input files, official answers, and CKE marking criteria. Supported tasks also provide interactive answer checking.

| Command | Purpose |
| --- | --- |
| `npm run tasks:validate` | Validate task content, source references, files, and marking criteria |
| `npm run tasks:test` | Run task validator tests |
| `npm run tasks:review` | Generate the task classification report |
| `npm run grading:review` | Generate the marking criteria coverage report |
| `npm run practice:validate` | Validate practice models and task references |
| `npm run practice:review` | Generate the practice coverage report |

The build validates both task content and practice models. Answers and marking criteria are rendered during the build; their content is excluded from the catalog search index.

Maintenance documentation: [task catalog](docs/task-catalog.md), [marking criteria](docs/task-grading.md), and [interactive practice](docs/task-practice.md). The report commands generate local Markdown summaries in `.tools/task-reports/`. These outputs are derived from the source data and are not tracked.

## Study guide and publications

`/matura-2027/` combines exam requirements, a skills map, study paths, and a checklist. Exam facts and their review date are stored in `src/data/matura-2027.ts`; supporting sources are recorded in the [source audit](docs/matura-2027-sources.md). Self-assessment is stored locally in the browser under `matura:2027:study:v1`.

`/wiedza/` lists published materials from `src/content/publications/`. Astro renders Markdown during the build. Draft articles are excluded from generated pages, the index, and the sitemap. The annual guide uses a separate route whose publication behavior is described in the publication guide. The [publication guide](docs/publications.md) and [Markdown template](docs/templates/publication.md) describe the content format and publishing process.

## Navigation and shared layouts

Astro's `ClientRouter` handles navigation between pages. Browser scripts use `src/scripts/page-lifecycle.ts` to initialize interactions after navigation and clean up when leaving a page.

The homepage groups lesson details and subject coverage into collapsible sections. Links to existing section anchors expand their containing sections. The materials block calculates task, practice, and exam totals during the build. Material pages share the server-rendered `ContactPanel` with the homepage.

Navigation tests are in `tests/navigation.spec.ts` and `tests/client-navigation.spec.ts`. Material layouts are covered by `tests/materials-presentation.spec.ts`; tests that need expanded homepage sections use `tests/support/expanded-home.ts`.
