# Exam archive maintenance

The archive is served as static files on the existing hosting platform. `/arkusze/` displays Formula 2023 by default and the full list when JavaScript is disabled. Filters use the `formula`, `year`, `level`, and `kind` query parameters. `formula=all` selects all formulas, and the clear-filters action displays the entire collection. Each exam page has a canonical URL without query parameters. The `powrot` parameter preserves the return address of the filtered list.

## Paper reader

Exam pages provide original downloads, a PDF preview, and a task index. Papers represented in the task catalog also provide an HTML reader, grouped by parent task. Instructions, input-file links, editorial notes, and marking criteria are rendered during the build. Interactive answer checking is available on individual subtask pages.

| Parameter | Behavior |
| --- | --- |
| `widok=zadania` | Opens the HTML task reader; PDF is the default |
| `zadanie=4` | Selects parent task 4 in either mode |
| `powrot` | Preserves the archive filters and return position |
| `#podpunkt-4-2` | Identifies a subtask within the HTML reader |

PDF mode links to the first physical `sheetPages` entry using `#page=`. Browser PDF viewers may handle this fragment differently; scrolling inside a PDF does not update task selection. Invalid modes fall back to PDF, and invalid task numbers select the first task. Reader changes participate in browser history; preferences are not stored between papers.

Return links accept only task numbers and anchors belonging to the current paper. Without JavaScript, downloads, PDF previews, and links to individual task pages remain available. Multipart papers retain separate PDF controls.

Reader behavior is covered by `tests/exam-reader.spec.ts`, including history, return links, downloads, marking panels, mobile layouts, and operation without JavaScript.

## Adding or updating an exam set

Import workflow:

1. Identification of the standard variant in an official CKE, BIP, or OKE archive. The formula and session are verified against the document description rather than inferred solely from the year or server directory. The main session in 2020 took place in June. Formula 2015 and the older formula were used concurrently.
2. Creation of an entry in `src/data/exam-sources.json` or an update to its `files` list. The `id` and `slug` remain stable because a slug change affects both the exam page and download URLs. Previously published URLs are preserved.
3. Import through `npm run exams:import`. This is the only command that requires access to the source servers. The importer downloads original files, writes metadata to `src/data/exams.json`, creates download bundles, and updates `docs/exam-import-report.json`.
4. Review of the report and new PDFs, including document headings, level, session, and exam parts. Verification covers whether the marking guidelines apply to both parts and whether the data package belongs to the same exam. Adapted variants are excluded from the standard collection.
5. Verification through `npm run exams:validate`, `npm run exams:test`, `npm run check`, and `npm test`. The source inventory, generated catalog and report, original files, and bundles under `public/pliki/matury/` are tracked in the repository. A push to `master` triggers the existing GitHub Actions deployment workflow.

On WSL, `bash scripts/npm.sh` is available as an alternative to `npm`. Python is also installed during the Docker build stage; it is not required on the static hosting server.

## Source entry format

Existing entries provide examples of the following fields:

- `id`, `slug`: unique identifiers without Polish diacritics. The slug includes the year, session, formula, and level.
- `year`, `month`: the year and month of the set. `month: 0` is reserved for sample materials without a confirmed session; in that case, the year identifies the exam edition for which the material was prepared.
- `formula`: `2023`, `2015`, or `starsza` (older formula). `formulaLabel` retains the designation confirmed by the source. Older formulas are not automatically assigned an arbitrary formula number.
- `level`: `podstawowy` (basic) or `rozszerzony` (advanced).
- `kind`: `glowny` (main session), `dodatkowy` (additional session), `probny` (mock exam), or `pokazowy` (sample paper). `sessionLabel` is a readable Polish name for the session or set.
- `sourcePages`: HTTPS URLs of official pages listing the materials.
- `files`: a list of original files with `kind` (`sheet`, `grading`, `data`, or `extra`), `label`, `filename`, `url`, and an optional `part` (1 or 2). `filename` is the local name of a PDF, ZIP, or RAR file. Combined marking guidelines covering both parts have no `part` field.
- `required`: required materials specified by `kind`, a descriptive `label`, and an optional `part`. Missing required materials appear in the public incomplete-set notice. Separate marking guidelines for parts I and II require two entries.

File sizes and SHA-256 checksums in the generated catalog are managed by the importer rather than edited manually. Existing files are retained and their checksums are verified. A corrupted local file interrupts the import; recovery involves identifying the cause, removing the affected file, and downloading it again. `npm run exams:import -- --refresh` explicitly downloads all originals again and refreshes their metadata after publisher-side changes have been reviewed.

The importer uses standard TLS verification. Sources that omit intermediate certificates from their certificate chain may require an addition to the local trusted CA store using a certificate obtained from its issuer, for example through `SSL_CERT_FILE`. TLS verification remains enabled. Regular builds do not connect to these servers.

## Files, missing materials, and validation

Each set has a dedicated directory at `public/pliki/matury/{slug}/`. `zestaw.zip` is a reproducible bundle of all available originals. Original RAR files retain their format and are labeled accordingly; the combined bundle always uses ZIP. The import process neither executes nor extracts programs from the source materials.

Each build starts with offline validation of identifiers, classification, sources, local paths, file sizes, SHA-256 checksums, PDF headers and end markers, ZIP CRC integrity, and bundle contents against the catalog. Original RAR files receive header and checksum verification without a full inspection of their contents. The validator does not render PDFs; preview verification is covered by browser tests and review of new documents during import.

Network errors encountered while downloading new files are recorded in the report. Missing required materials mark a set as incomplete. Sets with no available files have no public exam page. An invalid local file declared in the catalog blocks the build and deployment.

The import report covers entries in the source inventory. The separate `exam-source-audit.json` records the indexes examined and gaps across the collection. The number of imported sets does not establish completeness of the historical CKE archive.

## Deployment and hosting verification

The entire `dist/` directory is published, including `pliki/`, the `arkusze/` pages, `sitemap.xml`, and `robots.txt`. The deployment script transfers assets and downloadable documents before all HTML files. Obsolete `index.html` routes under the managed application namespaces are removed after HTML publication. Hosting configuration and older assets are retained; deployment details are documented in [README](../README.md#deployment).

Post-deployment verification covers `/arkusze/`, direct access to an exam page, a local PDF, and a `zestaw.zip` download. Download responses are expected to contain the requested PDF or ZIP content. Existing hosting redirect rules may require adjustment if they intercept the new paths and return HTML instead.
