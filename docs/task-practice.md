# Interactive practice maintenance

Each task has a JSON record in `src/data/task-practice/`. A record defines whether answer checking is available and links the practice model to the official marking document.

## Record modes

- `manual`: the task requires comparison with the official answer. A `reason` is required; fields and answer variants are absent.
- `interactive`: the record contains input fields and complete accepted answer variants. Checking applies to explicit results, not the method, program, SQL query, or chart used to obtain them. An optional `note` describes partial checking.

The catalog receives only `practiceAvailable`. Answer keys are embedded on individual task pages and are checked in the browser. Expressions, programs, and SQL are not executed.

## Fields and answers

Each field has a unique ID, an accessible label, a `kind` (`number`, `text`, `single`, or `multiple`), and an exact target selector such as `[data-practice="result"]`. The task content contains one matching anchor. Nested anchors are invalid.

Existing blank cells retain their original text without JavaScript. Additional answer areas use `data-practice-editorial` to distinguish them from the CKE instructions. Examples already filled in the source remain unchanged.

| Option | Behavior |
| --- | --- |
| `base` | Number base, from 2 to 36 |
| `unordered` | Compares semicolon-separated values without regard to order |
| `compact` | Removes spacing for explicitly selected text fields |
| Option `selector` | Associates a choice with an existing element inside the anchor |

Numeric comparison uses canonical strings rather than floating-point arithmetic. Each record supports at most 20 fields; the validator also counts answers within unordered lists toward the limit.

Each `variants` entry is a complete set of answers. Field values are arrays of accepted representations. Dependent alternatives belong in separate complete variants so that incompatible answers cannot be combined. Multiple-choice values are sorted and joined with `|`.

## Updating a practice model

1. Compare the task, shared context, and all official answer variants. Select results that can be checked unambiguously.
2. Add or update content anchors and field definitions. Record any limits of the automatic check in `note`.
3. Define complete answer variants and retain any examples already supplied by CKE.
4. Set `gradingSha256` to the SHA-256 checksum of `src/content/task-grading/{id}.md`. Changes to that document invalidate the practice record until its answers have been reviewed.
5. Run validation and the relevant browser tests.

```bash
npm run practice:validate
npm run tasks:test
npm run check
npm exec -- playwright test tests/practice.spec.ts
```

Browser tests cover field placement and accepted answers across interactive tasks, plus alternative answers, empty input, corrections, reset, and behavior without JavaScript.

`npm run practice:review` generates `.tools/task-reports/task-practice-report.md` with record modes, fields, and checking scope. The report is derived from the JSON records and is not tracked.
