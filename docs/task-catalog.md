# Task catalog maintenance

The catalog contains 154 subtasks from seven locally archived Formula 2023 exam sets. It does not cover every Formula 2023 paper published by CKE.

## Routes and data

| Path | Purpose |
| --- | --- |
| `/zadania/` | Searchable task catalog |
| `/zadania/tematy/{temat}/` | Catalog restricted to one topic |
| `/zadania/{identyfikator}/` | Individual task, source files, and marking criteria |
| `src/content/task-contexts/` | Shared instructions, exam identifier, and source PDF filenames |
| `src/content/tasks/` | Subtask instructions and metadata |
| `src/data/task-topics.json` | Topic identifiers and their subject areas |
| `docs/task-inventory/` | Source task numbers, points, PDF pages, and checksums |
| `docs/task-source-audit.json` | Comparison of task numbers, points, and first pages against PDF headings |
| `public/pliki/zadania/{examId}/` | Original input files and local illustrations |

Task IDs combine the exam ID and subtask number, replacing dots with hyphens. A task without numbered subtasks has one entry. Lettered parts within a numbered subtask remain in that entry. Only topics used by the catalog receive public pages.

## Content format

Frontmatter is a JSON object between `---` delimiters. This is valid YAML for Astro and allows the Python validator to use the standard library. The body contains Markdown and trusted HTML.

```markdown
---
{
  "parentId": "informatyka-2024-maj-formula-2023-rozszerzona-4",
  "number": "4.1",
  "title": "Task title in Polish",
  "summary": "Short description in Polish",
  "points": 2,
  "topics": ["algorytmy-liczbowe", "pliki"],
  "difficulty": 1,
  "rationale": "Difficulty rationale in Polish",
  "sheetPages": [10],
  "gradingPages": [9],
  "dataFiles": ["Dane-NF-2405/liczby.txt"],
  "dependencies": []
}
---

Original CKE instructions in Polish.
```

The example illustrates the schema; page numbers and content must match the source documents.

- `sheetPages` and `gradingPages` are physical PDF pages, counted from 1, including continuation pages in reading order. The first entry is used in `#page=` links.
- `dataFiles` contains exact paths inside the exam's source ZIP. Extracted files must remain byte-for-byte identical to the originals.
- `dependencies` lists earlier subtasks of the same parent task whose instructions are needed. Their instructions are rendered alongside the task.
- Year, formula, and session come from the exam catalog.
- `points` comes from the paper. An optional `editorialNote` records a discrepancy with the marking guidelines without altering either source.

Titles, summaries, topic assignments, difficulty ratings, and editorial notes are site content, separate from the original CKE instructions.

### Formatting

Tables use `table` and `th`, inside a keyboard-accessible scrolling wrapper:

```html
<div class="table-scroll" tabindex="0" role="region" aria-label="Table description in Polish">
  <table>...</table>
</div>
```

Code and pseudocode use `pre`, preserving indentation and escaping HTML characters. Formulas use `sup`, `sub`, or MathML. Illustrations are local extracts from the original PDF with meaningful alternative text. Task instructions remain text rather than screenshots. Cells already filled in the source remain filled; blank cells may be used for practice inputs.

### Difficulty

Difficulty is an editorial rating for advanced-level Matura preparation, not a CKE classification:

| Value | Meaning |
| --- | --- |
| `1` | Direct application of a basic operation or familiar method |
| `2` | Several operations or independent selection of a method |
| `3` | Complex reasoning, algorithm design, or data analysis |

The rating and its rationale are stored in each task's metadata. Official answers use a separate collection described in [Marking criteria maintenance](task-grading.md).

## Adding an exam

1. Import and validate the source materials using the [exam archive workflow](exam-archive.md).
2. Record task numbers, points, physical pages, and source SHA-256 checksums in the inventory.
3. Add contexts, task entries, marking criteria, and practice records. Copy input files from the source ZIP without modification.
4. Extend `EXAM_IDS` in `scripts/task_catalog.py` and update the coverage assertions and catalog description. Adding an archive entry alone does not add its tasks to the catalog.
5. Compare transcribed content with the PDFs, including formulas, tables, pseudocode, and continuation pages. Run validation and the relevant browser tests.

```bash
npm run tasks:validate
npm run tasks:test
npm run check
npm run build
npm test
```

Build validation is offline and requires no additional Python packages. An optional classification report is available through `npm run tasks:review`; it writes `.tools/task-reports/task-review.md` from the current metadata. Generated reports are local outputs and are not tracked.

### PDF extraction tools

PDF extraction and page rendering use an optional Python environment compatible with PyMuPDF:

```bash
python3 -m venv .tools/task-editor
.tools/task-editor/bin/python -m pip install -r scripts/requirements-task-editor.txt
.tools/task-editor/bin/python scripts/extract_task_sources.py informatyka-2026-maj-formula-2023-rozszerzona --render-page 4 --audit
```

Outputs are saved in `.tools/task-sources/`. Extraction supports transcription but does not produce published task content. The `--audit` option compares task numbers, points, and first physical pages with the inventory. Visual comparison remains necessary for formulas, column order, special characters, and pseudocode layout.

## Search and filtering

Filter parameters are `q`, `dzial`, `temat`, `trudnosc`, `rok`, `rodzaj`, `sprawdzanie`, and `sort`. Default values are omitted from the URL. Sort values are `latwiejsze` (default), `trudniejsze`, `najnowsze`, `najstarsze`, and `punkty`.

Search matches all query words, ignoring case and Polish diacritics. Filters are combined. Topic routes retain their fixed topic when filters are reset. The catalog is not paginated.

A normalized search index is serialized once in `data-task-facets`; cards reference it by task ID. The index excludes official answers and marking criteria. Without JavaScript, the initial catalog and topic links remain available.
