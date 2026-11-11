# Marking criteria maintenance

Each task has a matching document in `src/content/task-grading/`, with the same filename as its task entry. Exam details, source PDF references, and physical page numbers come from the exam catalog and task inventory.

`TaskGrading` renders the answer and criteria at build time inside a native, initially closed `details` element. It requires no hydration and works without JavaScript. Answers are excluded from the catalog search index.

## Document format

Frontmatter is JSON between `---` delimiters. `answerStatus` is required:

| Value | Content |
| --- | --- |
| `provided` | Exactly two nonempty H2 sections: `Odpowiedź CKE` and `Zasady oceniania CKE` |
| `not-provided` | A nonempty `Zasady oceniania CKE` section only; the component displays an answer-unavailable notice |

The Polish headings are part of the content format and are checked by the validator. All 154 current entries have answers. `not-provided` records a confirmed absence in the source; it does not represent a missing or unfinished document.

```markdown
---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

Official answer in Polish.

## Zasady oceniania CKE

Official marking criteria in Polish.
```

An optional `editorialNote` records source discrepancies or typographical errors separately from the official content. Source code, SQL, and results are transcribed as published; corrections are not applied silently.

Content includes all answer variants, partial-credit conditions, and shared notes that affect marking. Curriculum mapping tables and answers to neighboring subtasks are excluded. The March 2022 task 4.4 discrepancy is retained explicitly: the paper assigns 3 points, while the marking criteria assign 2.

## Formatting and sources

Tables preserve row order and continuation pages. They use header cells and a scrolling wrapper with `tabindex="0"`, `role="region"`, and an accessible label. Code uses `pre` and `code`, with original indentation and escaped HTML characters. Plain output may use `pre` alone. Formulas use HTML or MathML.

Illustrations are extracted from the source PDF and stored in `public/pliki/zadania/{examId}/odpowiedzi/`, with alternative text. Complete answers remain text rather than page screenshots.

`docs/task-grading-inventory/{examId}.json` records the source PDF checksum and each task's:

- `id`, `answerStatus`, and `gradingPages`;
- `answerVariants`, with zero allowed only for `not-provided`;
- `hasTables`, `hasCode`, and `hasFigures` flags.

Pages are physical PDF pages counted from 1, including continuations. The first page is used in the source link. Checksums must match the source catalog and local file. A changed source requires a new comparison with the transcribed content.

The optional extraction tool can render marking guideline pages:

```bash
.tools/task-editor/bin/python scripts/extract_task_sources.py informatyka-2026-maj-formula-2023-rozszerzona --document grading --render-page 2
```

Environment setup is described in [Task catalog maintenance](task-catalog.md). Production validation does not require PyMuPDF or network access.

## Validation

```bash
npm run tasks:validate
npm run tasks:test
npm run check
npm test
```

Validation checks document coverage, statuses, required sections, references, inventories, source checksums, and local illustrations. It also compares the declared table, code, and figure flags with document content. These checks run during builds and in CI.

`npm run grading:review` generates `.tools/task-reports/task-grading-report.md` with coverage, variants, page references, and source checksums. The report is not tracked. Validation establishes structural consistency; content accuracy requires comparison with the original PDFs.
