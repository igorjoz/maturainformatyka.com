#!/usr/bin/env python3
"""Editorial helper: export local PDF text, render pages, and audit task headings.

Requires scripts/requirements-task-editor.txt. Never invoked by the production build.
"""
import argparse
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HEADING = re.compile(r'Zadanie\s+(\d+(?:\.\d+)?)\.?[^\n(]*\(0\s*[–−-]\s*(\d+)\)')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('exam_id')
    parser.add_argument('--output', type=Path, default=ROOT / '.tools/task-sources')
    parser.add_argument('--render-page', type=int, help='Physical PDF page, starting at 1')
    parser.add_argument('--document', choices=['sheet', 'grading'], default='sheet', help='Which source to render')
    parser.add_argument('--audit', action='store_true', help='Compare source headings and points to inventory')
    args = parser.parse_args()
    try:
        import pymupdf
    except ImportError as error:
        raise SystemExit('Install the optional editorial requirements in a virtual environment first.') from error
    exams = json.loads((ROOT / 'src/data/exams.json').read_text(encoding='utf-8'))
    exam = next((exam for exam in exams if exam['id'] == args.exam_id), None)
    if not exam:
        raise SystemExit('Unknown local exam ID')
    args.output.mkdir(parents=True, exist_ok=True)
    headings = []
    for kind in ['sheet', 'grading']:
        source = next(file for file in exam['files'] if file['kind'] == kind)
        with pymupdf.open(ROOT / 'public' / source['path'].lstrip('/')) as doc:
            pages = []
            for number, page in enumerate(doc, 1):
                text = page.get_text(sort=True)
                pages.append(f'=== PDF PAGE {number} ===\n{text}')
                if kind == 'sheet':
                    headings.extend({'number': match[1], 'points': int(match[2]), 'firstPage': number} for match in HEADING.finditer(text))
            (args.output / (args.exam_id + '-' + kind + '.txt')).write_text('\n\n'.join(pages), encoding='utf-8')
            if kind == args.document and args.render_page:
                if not 1 <= args.render_page <= len(doc):
                    raise SystemExit('Page outside the PDF')
                image = doc[args.render_page - 1].get_pixmap(matrix=pymupdf.Matrix(1.6, 1.6))
                image.save(args.output / f'{args.exam_id}-{kind}-page-{args.render_page}.png')
    (args.output / (args.exam_id + '-headings.json')).write_text(json.dumps(headings, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if args.audit:
        inventory = json.loads((ROOT / 'docs/task-inventory' / (args.exam_id + '.json')).read_text(encoding='utf-8'))
        expected = {task['number']: (task['points'], task['sheetPages'][0]) for task in inventory['tasks']}
        actual = {task['number']: (task['points'], task['firstPage']) for task in headings}
        if expected != actual or len(headings) != len(expected):
            raise SystemExit(f'Source headings differ from inventory. Expected {expected}; actual {actual}')
        print(f'{args.exam_id}: {len(headings)} headings and {sum(task["points"] for task in headings)} points match source PDF')
    print(args.output)


if __name__ == '__main__':
    main()
