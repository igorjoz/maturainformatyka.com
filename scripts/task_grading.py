"""Offline validation and source report for the official task grading collection."""
import hashlib
import html
import json
from pathlib import Path
import re
import urllib.parse

ANSWER_HEADING = '## Odpowiedź CKE'
CRITERIA_HEADING = '## Zasady oceniania CKE'


def check(condition, message):
    if not condition:
        raise ValueError(message)


def meaningful(block):
    text = html.unescape(re.sub(r'<!--.*?-->|<[^>]*>', '', block, flags=re.S)).strip()
    return bool(text or re.search(r'<img\b[^>]*\balt=[\"\'][^\"\']+', block))


def validate_grading(root, tasks, parents, inventory, exams, read_entry):
    grading = {}
    for path in (root / 'src/content/task-grading').rglob('*.md'):
        check(path.stem not in grading, f'Powtórzony dokument oceniania: {path.stem}')
        grading[path.stem] = read_entry(path)
    check(set(grading) == set(tasks), f'Niekompletne ocenianie. Brak: {sorted(set(tasks)-set(grading))}; nadmiar: {sorted(set(grading)-set(tasks))}')
    manifests = {}
    items = {}
    for path in (root / 'docs/task-grading-inventory').glob('*.json'):
        manifest = json.loads(path.read_text(encoding='utf-8'))
        exam_id = manifest['examId']
        check(exam_id not in manifests and exam_id in inventory, f'Błędny egzamin oceniania: {exam_id}')
        manifests[exam_id] = manifest
        source = next(file for file in exams[exam_id]['files'] if file['kind'] == 'grading')
        source_file = root / 'public' / source['path'].lstrip('/')
        check(manifest.get('sourceSha256') == source['sha256'] == hashlib.sha256(source_file.read_bytes()).hexdigest(), f'Zmienione źródło oceniania: {exam_id}')
        for item in manifest['tasks']:
            task_id = item['id']
            check(task_id not in items and task_id in tasks, f'Błędny lub powtórzony podpunkt oceniania: {task_id}')
            parent = parents[tasks[task_id][0]['parentId']][0]
            check(parent['examId'] == exam_id, f'Ocenianie przypisane do innego egzaminu: {task_id}')
            items[task_id] = item
    check(set(manifests) == set(inventory), 'Inwentaryzacja oceniania nie obejmuje wszystkich egzaminów')
    check(set(items) == set(tasks), 'Inwentaryzacja oceniania nie obejmuje wszystkich podpunktów')
    for task_id, (meta, body) in grading.items():
        status = meta.get('answerStatus')
        check(status in {'provided', 'not-provided'}, f'Niepoprawny status odpowiedzi: {task_id}')
        if 'editorialNote' in meta:
            check(isinstance(meta['editorialNote'], str) and meta['editorialNote'].strip(), f'Pusta uwaga oceniania: {task_id}')
        headings = re.findall(r'^## .+$', body, flags=re.M)
        expected = [ANSWER_HEADING, CRITERIA_HEADING] if status == 'provided' else [CRITERIA_HEADING]
        check(headings == expected, f'Błędne sekcje oceniania: {task_id}')
        before, criteria = body.split(CRITERIA_HEADING, 1)
        check(meaningful(criteria), f'Brak kryteriów oceniania: {task_id}')
        if status == 'provided':
            prefix, answer = before.split(ANSWER_HEADING, 1)
            check(not prefix.strip() and meaningful(answer), f'Brak odpowiedzi CKE: {task_id}')
        else:
            check(not before.strip(), f'Treść odpowiedzi przy statusie not-provided: {task_id}')
        item = items[task_id]
        check(item.get('answerStatus') == status, f'Status niezgodny z inwentaryzacją oceniania: {task_id}')
        check(item.get('gradingPages') == tasks[task_id][0]['gradingPages'], f'Strony niezgodne z inwentaryzacją oceniania: {task_id}')
        variants = item.get('answerVariants')
        check(type(variants) is int and (variants > 0 if status == 'provided' else variants == 0), f'Błędna liczba wariantów odpowiedzi: {task_id}')
        for flag, pattern in [('hasTables', r'<table\b'), ('hasCode', r'<pre\b[^>]*>\s*<code\b|^```'), ('hasFigures', r'<img\b|!\[')]:
            check(type(item.get(flag)) is bool and item[flag] == bool(re.search(pattern, body, re.M)), f'Niezgodność {flag} w ocenianiu: {task_id}')
        for match in re.findall(r'(?:src=[\"\']([^\"\']+)[\"\']|!\[[^\]]*\]\(([^)]+)\))', body):
            url = next(value for value in match if value)
            path = (root / 'public' / urllib.parse.unquote(url).lstrip('/')).resolve()
            check(url.startswith('/') and not url.startswith('//') and path.is_relative_to((root / 'public').resolve()) and path.is_file(), f'Brak lokalnej ilustracji oceniania: {task_id}: {url}')
        for alt in re.findall(r'!\[([^\]]*)\]\([^)]+\)', body):
            check(alt.strip(), f'Brak opisu ilustracji oceniania: {task_id}')
        for image in re.findall(r'<img\b[^>]*>', body):
            check(re.search(r'\balt=[\"\'][^\"\']+', image), f'Brak opisu ilustracji oceniania: {task_id}')
    return {'entries': grading, 'manifests': manifests, 'items': items}


def write_grading_report(root, catalog):
    grading = catalog['grading']
    provided = sum(meta['answerStatus'] == 'provided' for meta, _ in grading['entries'].values())
    lines = ['# CKE answer and marking coverage', '',
             f"Coverage: {len(grading['entries'])} subtasks from {len(grading['manifests'])} exam sets.", '',
             f'Answers provided: {provided}. Answers absent from source: {len(grading["entries"])-provided}. Missing entries: 0.', '',
             'Generated from validated content and source inventories. Source notes retain their original Polish text. Structural validation does not establish transcription accuracy.', '']
    for exam_id in sorted(grading['manifests']):
        manifest = grading['manifests'][exam_id]
        lines += ['## ' + exam_id, '', 'Marking source SHA-256: `' + manifest['sourceSha256'] + '`.', '',
                  '| Subtask | CKE answer | Variants | PDF pages | Tables / code / figures |', '| --- | --- | --- | --- | --- |']
        for item in sorted(manifest['tasks'], key=lambda item: tuple(int(n) for n in catalog['tasks'][item['id']][0]['number'].split('.'))):
            task_id = item['id']
            number = catalog['tasks'][task_id][0]['number']
            flags = [name for flag, name in [('hasTables', 'tables'), ('hasCode', 'code'), ('hasFigures', 'figures')] if item[flag]]
            lines.append(f"| [{number}](/zadania/{task_id}/) | {'Provided' if item['answerStatus']=='provided' else 'Absent from source'} | {item['answerVariants']} | {', '.join(map(str,item['gradingPages']))} | {', '.join(flags) or '—'} |")
            note = grading['entries'][task_id][0].get('editorialNote')
            if note:
                lines.append(f"| Note {number} | {note.replace('|', chr(92)+'|')} | | | |")
        lines.append('')
    output = root / '.tools/task-reports/task-grading-report.md'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')
