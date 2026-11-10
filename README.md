# Computer science Matura preparation — Igor Józefowicz

A static website built with React, Astro, TypeScript, and custom CSS. The homepage is complemented by an exam archive at `/arkusze/` and individual exam pages with locally hosted downloads and PDF previews. Astro generates HTML documents, metadata, and optimized images. The project has no custom backend, submission form, or analytics. Booking is handled by an embedded Google Calendar appointment page. The Manrope font is hosted locally, and original artwork is stored in `images/`.

## Local development

Requirements: Node.js 22.12 or newer in an LTS release supported by Astro, and Python 3.10 or newer for archive validation. No additional Python packages are required.

```bash
npm ci
npm run dev
```

Local URL: `http://127.0.0.1:4321`.

### Docker

The following command builds the website and starts it in the background. Docker with Compose is required.

```bash
docker compose up --build -d
```

The website is available at **http://localhost:4321**. The build stage validates and compiles the project, and Nginx serves the generated static files. The port is bound to the local interface only. Source changes require an image rebuild using the same command.

```bash
docker compose ps
docker compose logs --tail=50 web
docker compose down
```

### WSL: Windows npm and ENOTEMPTY errors

A `command -v npm` result of `/mnt/c/Program Files/nodejs/npm` indicates that Windows npm is operating on a Linux directory. A log path such as `C:\Users\...\npm-cache` is another indication of the same configuration.

The ignored `.tools/node/` directory contains a checkout-local Linux Node.js runtime when one has been provisioned. The wrapper prefers that runtime and rejects incompatible Windows installations:

```bash
bash scripts/npm.sh ci
bash scripts/npm.sh run dev
```

### Static build preview

```bash
python3 -m http.server 4321 --bind 0.0.0.0 --directory dist
```

The generated website is then available at **http://localhost:4321**, including from a Windows browser when using WSL. Ctrl+C stops the server.

## Validation and builds

```bash
npm run check
npm run exams:test
npm run build
npm run preview
```

The output directory is `dist/`. Static hosting requires its entire contents, including `_astro/` and the exam downloads. Hostinger publication uses the GitHub Actions workflow described below.

### Exam archive

Exam papers, marking guidelines, and task data are stored in `public/pliki/matury/`. The source inventory is maintained in `src/data/exam-sources.json`. The [archive maintenance guide](docs/exam-archive.md) describes material imports, ZIP generation, and validation commands. The [import report](docs/exam-import-report.json) records available files and missing materials for individual sets, while the [source audit](docs/exam-source-audit.json) records gaps across the collection. The archive is not declared to be a complete historical collection of CKE materials.

### Tests

Browser tests use Playwright and Chromium. Browser installation is required after `npm ci` and again after Playwright updates:

```bash
npx playwright install --with-deps chromium
npm test
```

`npm test` builds the website and starts a temporary preview on port 4322. Coverage includes content and metadata, images, navigation, booking integration, contact links, all three lesson levels, theory notation, section ordering, the mobile menu, keyboard access, reduced motion, and operation without JavaScript. Archive tests cover filtering and URL history, exam details, local PDF and ZIP downloads, multipart previews, incomplete sets, empty results, responsive layouts, metadata, and the sitemap.

Lesson laboratory tests cover stepping, previous steps, reset, playback at 1200 ms intervals, pauses outside the section or in a hidden tab, and level changes. Separate algorithm tests use independent calculations, including negative numbers and ties, and verify snapshot independence. Python highlighting tests check token colors, contrast, selection, copying, and indentation, including without JavaScript. Layout coverage includes widths of 360, 390, 768, 1024, 1366, and 1440 px and anchor visibility below the sticky header.

Google Calendar requests are replaced with local responses. Tests neither create bookings nor verify the availability of the external service. Failure screenshots and traces are written to the ignored `test-results/` directory.

## Automated Hostinger deployments

The `.github/workflows/deploy.yml` workflow installs dependencies and Chromium, runs type checks, archive validator tests, and the browser suite with its build, then transfers `dist/` using rsync over SSH. Failed checks block deployment. Docker is not required on the hosting server.

- Pushes to `master` trigger checks, the build, tests, and deployment.
- Pull requests targeting `master` trigger checks, the build, and tests without access to deployment secrets.
- Manual execution is available under **Actions → Deploy to Hostinger → Run workflow**. The `master` branch supports deployment; `dry_run` verifies the connection and transfer plan without changing hosted files. Manual execution on other branches runs checks, the build, and tests only.
- Deployments are serialized. Images, styles, scripts, and exam downloads are transferred before all HTML documents, including exam pages. Existing files, including `.htaccess` and older `_astro/` assets, remain on the server.

### Deployment secrets

The workflow requires six repository secrets under **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
| --- | --- |
| `HOSTINGER_HOST` | Server IP address or hostname from hPanel, without `ssh://` or a port. |
| `HOSTINGER_PORT` | SSH port from hPanel; shared hosting commonly uses `65002`. |
| `HOSTINGER_USER` | SSH username from hPanel. |
| `HOSTINGER_PATH` | Existing writable website directory, such as `/home/u123456789/domains/maturainformatyka.com/public_html`, using the actual account path. |
| `HOSTINGER_SSH_KEY` | Complete passphrase-free private key, including its `BEGIN` and `END` lines. The public `.pub` file is not used for this secret. |
| `HOSTINGER_KNOWN_HOSTS` | Complete `known_hosts` entry for the same host and port, such as `[SERVER_IP]:65002 ssh-ed25519 AAAA…`. A `SHA256:…` fingerprint alone is insufficient. |

Hostinger requires SSH access to be enabled and the corresponding public key to be registered in hPanel under **SSH Access → Add SSH key**. The server key fingerprint is verified against the value displayed in hPanel before `HOSTINGER_KNOWN_HOSTS` is configured. Private keys are excluded from the repository.

An existing host entry saved through Windows PowerShell can be copied to the clipboard with:

```powershell
Get-Content "$HOME\.ssh\hostinger_known_hosts" | Set-Clipboard
```

### Initial deployment and updates

1. A backup of the current Hostinger website directory is required before the initial transfer, which overwrites files with matching names.
2. The workflow and `scripts/deploy-hostinger.sh` are published to the repository, and all six secrets are configured. A push to `master` triggers deployment immediately. An initial dry run can be arranged by adding the workflow on another branch, configuring secrets after its merge to `master`, and then starting a manual run with `dry_run` enabled.
3. A successful dry run is followed by a workflow run on `master` without `dry_run`. Verification covers the live website, artwork, booking calendar, archive pages, and downloads. Hostinger or CDN caches may require clearing if an older version remains visible.
4. Subsequent pushes to `master` publish updates automatically. Missing secrets, invalid keys, connection errors, and failed builds block deployment. Logs are available under **Actions**.

The `scripts/deploy-hostinger.sh` script reads the environment variables listed above. Local execution is supported on Linux or WSL after a build, with SSH and rsync installed. `DEPLOY_DRY_RUN=true bash scripts/deploy-hostinger.sh` performs a trial transfer. Temporary key files are removed on exit, and unknown server keys are not accepted automatically. Deployment is not an atomic directory replacement and does not create a hosting backup.

## Source organization

- `src/data/site.ts`: website content, pricing, contact details, projects, FAQ, lesson data, and booking configuration.
- `src/components/`: React sections, icons, and decorative elements; `types.ts` defines component data contracts.
- `src/components/LessonExample.tsx`: the three lesson levels, static content and code, level and playback reducers, and interactive controls.
- `src/components/Subjects.tsx`: the two illustrated learning areas, topic tabs, theory, and exam examples.
- `src/components/PortraitScene.tsx`: portrait composition, orbital elements, and visual layers.
- `src/hooks/useSectionMotion.ts`: pointer, scroll, and entrance effects, including observer, listener, and timer cleanup.
- `src/scripts/lesson-trace.ts`: execution steps for the three demonstration algorithms, including code lines, variables, and student-facing explanations.
- `src/styles/global.css`: base styles, responsive layouts, and reduced motion; `refresh.css`: composition, spacing, and controls; `lesson-lab.css`: laboratory controls and active-step styling.

Student-facing content remains in Polish. Developer documentation, comments, test descriptions, and diagnostic messages use English. Existing Polish public URLs, anchors, query parameters, and catalog values are retained for compatibility with the website and archived data.

### Images and lesson content

Learning-area artwork comes from `images/algorithm.png` and `images/relations.png`. The originals are 1536 × 1024 px. Astro generates AVIF, WebP, and fallback JPEG variants at widths of 360, 640, 960, and 1280 px with quality 75. The browser selects a variant based on display width and pixel density; `sizes` also accounts for the two-column tablet layout. Images use lazy loading and asynchronous decoding. Project cards in the about section use smaller thumbnails.

The offer section uses `#oferta`, the lesson example uses `#przyklad`, and booking uses `#rezerwacja`. Booking follows the offer and precedes the FAQ. All primary booking actions point to `#rezerwacja`.

Lesson content is stored in `lessonExample.examples` in `src/data/site.ts`; each `actions` list defines forward and return controls. The levels cover counting even numbers, maximum contiguous subarray sum using Kadane's algorithm, and the length of a strictly increasing subsequence using O(n²) dynamic programming. The final example returns length 4, and the highlighted values `[1, 2, 4, 9]` illustrate one valid subsequence. Level changes move focus to the task heading and account for the sticky header and reduced-motion preferences. Without JavaScript, all examples remain visible in sequence with navigation links. The theory badge displays `1010` with a subscript `2`, stored as `base` in the data.

Python examples use English identifiers such as `numbers`, `even_count`, `current_sum`, `best_sum`, and `lengths`. The `code` field remains plain text. `src/build/page-props.ts` applies Shiki highlighting during the build and passes serializable tokens to React. `PythonCode` renders tokens and numbered lines, including without JavaScript; Shiki is excluded from browser bundles. The `css-variables` theme uses the `--astro-code-*` palette in `.lesson-code` in `src/styles/global.css`. Code blocks preserve indentation, text selection and copying, keyboard focus, and independent horizontal scrolling. Font sizes are 14 px on desktop and 13 px on mobile.

### React and hydration

`src/pages/index.astro` handles document structure and composition. The `@astrojs/react` integration renders component HTML during the build, and React adds browser interactions. Header and Hero use `client:load`. The laboratory, subjects, learning process, projects, testimonials, offer, and contact sections use `client:visible` with a 200 px margin. FAQ, booking, and footer content require no hydration. The project has no client-side router or global state store.

Images and syntax tokens are prepared by the build module. `ResponsivePicture` renders the generated AVIF/WebP variants and fallback image. Components receive typed props, while image processing tools and Shiki remain outside client bundles.

The first React render matches the generated HTML. Complete examples and descriptions remain visible before hydration and without scripts. JavaScript-dependent controls appear only after the corresponding component has initialized. The laboratory uses `useReducer`; each topic group has independent tab state. Section effects use refs, observers, and CSS variables, so pointer motion does not trigger React renders. Effects release their resources on unmount.

`npm run report:bundle` reports the total size of JavaScript files in `dist/_astro/`, including gzip size.

### Interactive learning areas

The `#zakres` section contains two independent topic groups below the illustrations: programming and algorithms, and spreadsheets and databases. The first topic is visible initially. Selecting another topic replaces its description and example in place without closing the panel or changing card height. Left and Right arrows cycle through tabs, Home and End select the first and last tabs, and focus remains on the selected tab. Tab advances to the panel and its links. The programming panel links to the basic lesson example.

Panels share a CSS grid cell that reserves space for the longer description, including after viewport changes. The inactive panel uses `visibility: hidden`, `aria-hidden`, and `inert`, excluding it from keyboard navigation and screen readers. Without JavaScript, all topics appear as ordinary content with headings, while tab controls remain hidden. Reduced motion disables crossfades. Topic selection is not persisted between visits. Theory and exam examples have separate cards with immediately visible content.

The exam card presents an excerpt from task 7.1, “Staw,” in the official May 2026 CKE paper, Formula 2023, worth 3 points. The quotation is separated from the teaching guidance. Links open page 16 of the locally hosted paper and page 14 of the locally hosted marking guidelines. Attribution, context, quotation, guidance, and URLs are defined in `maturaExample` in `src/data/site.ts`. The browser uses the local archive rather than fetching these documents from CKE; tests verify the links without contacting CKE servers.

Each learning area's title and introduction appear above its illustration. Tabs and the topic description occupy a separate padded card directly below it. Artwork responds to a precise pointer with tilt, zoom, and a glow; touch produces a brief highlight. Two hotspots per illustration select topics using the same state as the tabs. Hotspot selection focuses the active panel without a native browser jump. A 420 ms animation reveals only the necessary part of the description while retaining at least 96 px of artwork above it. Very short viewports prioritize illustration context and the start of the description. The animation follows layout changes during loading but stops aligning the page after completion. Wheel, touch, or keyboard input interrupts it. Reduced motion makes the transition immediate. Selecting the same hotspot repeats this behavior; tabs alone do not scroll the page. Hotspots measure at least 44 × 44 px, and keyboard focus outlines remain inside the panel.

Topic content and identifiers are defined in `src/data/site.ts`; state, hotspot positions, and interaction logic are in `src/components/Subjects.tsx`; styles are in `src/styles/subjects.css`. Tests in `tests/subjects.spec.ts` cover switching, keyboard access, accessibility, no-script behavior, and stable height at five viewport widths. `tests/visual-effects.spec.ts` adds hotspot, pointer, touch, and page-end ribbon coverage.

### Interactive lesson laboratory

Each level initially shows its complete solution. The trace control opens step 0, with previous and next steps, play/pause, reset, and a return to the full solution. Level changes restore the solution summaries. A direct link to an example's anchor opens the corresponding level.

The `algorithm` field selects `parity`, `kadane`, or `lis`. The generator receives the same `values` rendered by the component and creates independent snapshots with data indices, code line numbers, variables, and explanations. React adds `data-code-line` to the syntax tokens prepared during the build without changing the code text. Changes to Python examples require matching line-number updates in the generator. This is a fixed-data demonstration; the website does not execute Python. LIS reconstruction illustrates a valid subsequence, while the displayed Python code calculates its length.

Playback advances one step every 1200 ms. It stops at the final step, on level changes, when the section leaves the viewport, and when the document becomes hidden. Resumption is manual. Reduced motion retains manual stepping and disables timed playback and animated transitions. Controls support the keyboard and measure at least 44 × 44 px. Step explanations use `aria-live`.

### Visual effects and motion

The header displays reading progress and marks the active section with `aria-current="location"`; these indicators also work with reduced motion. Sections share `--motion-reaction` (200 ms), `--motion-enter` (550 ms), and `--ease-out`.

An illuminated orbit segment, active learning-process steps, and sequential benefit entrances complement the existing animations. Project cards have a pointer-following glow and a slight thumbnail zoom. Pointer effects are enabled only above 900 px with a precise pointer; touch uses a brief highlight. Artwork remains local, and decorative elements use CSS and SVG.

The portrait source is `images/portrait-art.png`. Responsive AVIF/WebP variants and fallback PNG files preserve transparency. Changes to the original require regeneration of the light-background Open Graph variant before the build:

```bash
bash scripts/npm.sh exec -- node scripts/social-image.mjs
bash scripts/npm.sh run build
```

Canonical and Open Graph URLs use `https://maturainformatyka.com`, configured through `site` in `astro.config.mjs`. This setting controls metadata, not domain registration or hosting.

Navigation, FAQ, and the complete portrait composition work without JavaScript. Scripts close the mobile menu and add animations. Orbits and color shapes animate only in visible sections and pause in hidden tabs. Backgrounds respond to scrolling, and the process line reflects progress. Reduced motion disables animation and parallax. Content remains readable before effects initialize. FAQ uses native `details` with smooth expansion where supported.

At the end of the page, green and copper SVG ribbons unfold around the contact section, accompanied by falling confetti and a glow on the introductory meeting panel. The effect starts once when the footer's end becomes visible, and the ribbons remain visible afterward. Decorations stay behind content, do not intercept clicks, respect reduced motion, and pause outside the viewport. Mobile layouts use lower intensity and fewer particles. Styles are defined in `src/styles/celebration.css`, with SVG and particles in `src/components/ContactCelebration.tsx`. Meeting buttons continue to work without JavaScript.

## Google Calendar booking configuration

The appointment schedule configuration consists of the following stages:

1. Creation of a Google Calendar appointment schedule with the Polish introductory-meeting title, a 30-minute duration, suitable availability, and the `Europe/Warsaw` time zone. Initial scheduling settings may include 24 hours' notice, a 30-day booking window, and a 15-minute buffer between meetings.
2. Calendar conflict checking, Google Meet as the meeting location, and free appointments. Additional features, including reminders, depend on the Google subscription.
3. Selection of the single booking-page embed option in the schedule's sharing settings. The configuration uses the complete URL from the generated iframe's `src` attribute, rather than the entire HTML snippet or a shortened `calendar.app.google` link. The ordinary personal calendar remains private.
4. Assignment of that URL to `introMeeting.bookingUrl` in `src/data/site.ts`, using ordinary `&` characters rather than HTML `&amp;` entities in TypeScript. Validation and a build precede publication of the updated `dist/` directory.

The `#rezerwacja` section follows the offer and precedes the FAQ. It contains the meeting description, agenda, and practical questions. The iframe loads lazily and is accompanied by an independent booking-page link and email and telephone contact options. Without a booking URL, the section presents an email contact action with a prepared message instead of an empty iframe or broken Google links. An invalid booking URL blocks the build.

Verification of a live schedule covers desktop and mobile time-slot selection and the alternative booking link. A test booking from a separate email address verifies confirmation, the calendar entry, the Google Meet link, and removal of the booked slot from availability. An existing event marked as busy should also block its time slot. The verification process ends with cancellation of the test booking and removal of test events.

Google documentation: [creating appointment schedules](https://support.google.com/calendar/answer/10729749?hl=en) and [embedding a booking page](https://support.google.com/calendar/answer/10733297?hl=en).

## Logo and favicons

The original artwork is stored in `images/logo-book-code.png`. The header variant trims transparent margins, while favicons retain the original colors and transparency. Asset regeneration after source changes uses:

```bash
bash scripts/npm.sh exec -- node scripts/brand-assets.mjs
bash scripts/npm.sh run build
```

The script writes the logo to `src/assets/logo-book-code.png`, PNG favicons at 32 and 48 px, and `public/favicon.ico` containing 16, 32, and 48 px variants.
