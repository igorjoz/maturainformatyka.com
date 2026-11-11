#!/usr/bin/env python3
"""Validate the task corpus offline or generate a local classification report."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import urllib.parse
import zipfile
from task_grading import validate_grading, write_grading_report

ROOT = Path(__file__).resolve().parents[1]
EXAM_IDS = {
    'informatyka-2022-grudzien-probna-formula-2023-rozszerzona',
    'informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona',
    'informatyka-2023-maj-formula-2023-rozszerzona',
    'informatyka-2024-grudzien-probna-formula-2023-rozszerzona',
    'informatyka-2024-maj-formula-2023-rozszerzona',
    'informatyka-2025-maj-formula-2023-rozszerzona',
    'informatyka-2026-maj-formula-2023-rozszerzona',
}


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def read_entry(path):
    match = re.fullmatch(r'---\s*\n(.*?)\n---\s*\n(.*)', path.read_text(encoding='utf-8'), re.S)
    if not match:
        raise ValueError(f'{path}: wymagany frontmatter JSON pomiędzy ---')
    try:
        meta = json.loads(match[1])
    except json.JSONDecodeError as error:
        raise ValueError(f'{path}: niepoprawne metadane JSON: {error}') from error
    return meta, match[2]


def entries(directory):
    result = {}
    for path in directory.rglob('*.md'):
        if path.stem in result:
            raise ValueError(f'Powtórzony identyfikator: {path.stem}')
        result[path.stem] = read_entry(path)
    return result


def check(condition, message):
    if not condition:
        raise ValueError(message)


def local_path(root, url):
    path = (root / 'public' / urllib.parse.unquote(url).lstrip('/')).resolve()
    check(path.is_relative_to((root / 'public').resolve()), f'Plik poza public: {url}')
    check(path.is_file(), f'Brak pliku: {url}')
    return path


def check_pages(values, maximum, label):
    check(isinstance(values, list) and values and all(type(page) is int and 1 <= page <= maximum for page in values), f'Błędne strony PDF: {label}')
    check(values == sorted(set(values)), f'Powtórzone lub nieuporządkowane strony: {label}')


def validate(root=ROOT, expected_exam_ids=EXAM_IDS):
    topics = read_json(root / 'src/data/task-topics.json')
    topic_ids = [topic['id'] for topic in topics]
    check(len(topic_ids) == len(set(topic_ids)), 'Powtórzone identyfikatory tematów')
    sections = {'programowanie', 'algorytmika', 'arkusze-kalkulacyjne', 'bazy-danych', 'teoria'}
    for topic in topics:
        check(topic['section'] in sections and topic['name'] and re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', topic['id']), f'Błędny temat: {topic}')
    exams = {exam['id']: exam for exam in read_json(root / 'src/data/exams.json')}
    parents = entries(root / 'src/content/task-contexts')
    tasks = entries(root / 'src/content/tasks')
    inventory = {}
    for path in (root / 'docs/task-inventory').glob('*.json'):
        item = read_json(path)
        check(item['examId'] not in inventory, f'Powtórzony egzamin w inwentaryzacji: {path}')
        inventory[item['examId']] = item
    check(set(inventory) == set(expected_exam_ids), 'Inwentaryzacja musi obejmować dokładnie ustalone egzaminy')
    expected = {}
    for exam_id, item in inventory.items():
        check(exam_id in exams and exams[exam_id]['formula'] == '2023', f'Niepoprawny egzamin: {exam_id}')
        for kind, key in [('sheet', 'sheetPages'), ('grading', 'gradingPages')]:
            check(type(item[key]) is int and item[key] > 0, f'Brak liczby stron: {exam_id}')
            source = next(file for file in exams[exam_id]['files'] if file['kind'] == kind)
            # A changed source requires explicitly rechecking the inventory and page links.
            check(item.get('sourceSha256', {}).get(kind) == source['sha256'], f'Nieaktualna inwentaryzacja źródła {kind}: {exam_id}')
        for task in item['tasks']:
            number = task['number']
            check(isinstance(number, str) and re.fullmatch(r'\d+(?:\.\d+)?', number), f'Błędny numer zadania: {exam_id}')
            task_id = exam_id + '-' + number.replace('.', '-')
            check(task_id not in expected, f'Powtórzony podpunkt w inwentaryzacji: {task_id}')
            expected[task_id] = (exam_id, task)
    check(set(tasks) == set(expected), f'Niezgodność podpunktów z inwentaryzacją. Brak: {sorted(set(expected)-set(tasks))}; nadmiar: {sorted(set(tasks)-set(expected))}')
    used_parents = set()
    zip_cache = {}
    for task_id, (meta, body) in tasks.items():
        exam_id, original = expected[task_id]
        check(meta.get('parentId') in parents, f'Brak zadania nadrzędnego: {task_id}')
        parent, context = parents[meta['parentId']]
        used_parents.add(meta['parentId'])
        check(parent['examId'] == exam_id, f'Niepoprawny egzamin zadania: {task_id}')
        check(meta['number'].split('.')[0] == parent['number'], f'Niepoprawny rodzic: {task_id}')
        check(meta['parentId'] == exam_id + '-' + parent['number'], f'Niepoprawny identyfikator rodzica: {task_id}')
        for key in ['number', 'points', 'sheetPages', 'gradingPages']:
            check(meta.get(key) == original[key], f'Niezgodność {key} z inwentaryzacją: {task_id}')
        check(type(meta['points']) is int and meta['points'] >= 0, f'Niepoprawna punktacja: {task_id}')
        check(meta.get('topics') and len(meta['topics']) == len(set(meta['topics'])) and set(meta['topics']) <= set(topic_ids), f'Nieznany/powtórzony temat: {task_id}')
        check(type(meta.get('difficulty')) is int and meta['difficulty'] in {1, 2, 3}, f'Niepoprawna trudność: {task_id}')
        for field in ['title', 'summary', 'rationale']:
            check(isinstance(meta.get(field), str) and meta[field].strip(), f'Brak {field}: {task_id}')
        check(len(body.strip()) >= 20, f'Brak pełnego polecenia: {task_id}')
        source_files = exams[exam_id]['files']
        for kind, field, page_key in [('sheet', 'sheetFile', 'sheetPages'), ('grading', 'gradingFile', 'gradingPages')]:
            check(any(file['kind'] == kind and Path(file['path']).name == parent[field] for file in source_files), f'Brak źródłowego PDF: {task_id}')
            check_pages(meta[page_key], inventory[exam_id][page_key], task_id)
        check_pages(parent['sheetPages'], inventory[exam_id]['sheetPages'], meta['parentId'])
        for dep in meta.get('dependencies', []):
            check(dep in tasks and dep != task_id and tasks[dep][0]['parentId'] == meta['parentId'], f'Błędna zależność: {task_id} -> {dep}')
        # Local figures must exist, including Markdown and trusted HTML images.
        for figure in re.findall(r'(?:src=[\"\']([^\"\']+)[\"\']|!\[[^\]]*\]\(([^)]+)\))', body + '\n' + context):
            url = next(value for value in figure if value)
            check(url.startswith('/'), f'Ilustracja musi być lokalna: {task_id}')
            local_path(root, url)
        for name in meta.get('dataFiles', []):
            parts = Path(name).parts
            check(not Path(name).is_absolute() and all(part not in {'..', '.'} for part in parts), f'Niebezpieczna ścieżka danych: {task_id}')
            if exam_id not in zip_cache:
                archive = next(file for file in source_files if file['kind'] == 'data')
                check(archive['path'].endswith('.zip'), f'Wymagany ZIP danych: {exam_id}')
                with zipfile.ZipFile(local_path(root, archive['path'])) as z:
                    zip_cache[exam_id] = {name: z.read(name) for name in z.namelist() if not name.endswith('/')}
            check(name in zip_cache[exam_id], f'Brak oryginalnego pliku danych {name}: {task_id}')
            path = root / 'public/pliki/zadania' / exam_id / name
            check(path.is_file() and path.read_bytes() == zip_cache[exam_id][name], f'Plik danych różni się od oryginału: {task_id}: {name}')
    check(set(parents) == used_parents, 'Zadania nadrzędne bez podpunktów')
    # Detect dependency cycles even if malformed data refers to a later subtask.
    def visit(task_id, stack, done):
        check(task_id not in stack, f'Cykl zależności: {task_id}')
        if task_id in done:
            return
        for dep in tasks[task_id][0].get('dependencies', []):
            visit(dep, stack | {task_id}, done)
        done.add(task_id)
    done = set()
    for task_id in tasks:
        visit(task_id, set(), done)
    grading = validate_grading(root, tasks, parents, inventory, exams, read_entry)
    return {'tasks': tasks, 'parents': parents, 'inventory': inventory, 'topics': topics, 'grading': grading}


def write_review(root=ROOT):
    catalog = validate(root)
    names = {topic['id']: topic['name'] for topic in catalog['topics']}
    levels = {1: 'Easy', 2: 'Medium', 3: 'Hard'}
    lines = ['# Task classification', '',
             f"Coverage: {len(catalog['tasks'])} subtasks from {len(catalog['inventory'])} Formula 2023 exam sets.", '',
             'Generated from task metadata. Titles, topic names, rationales, and source notes retain their original Polish text.', '',
             'Difficulty: easy — a basic operation or familiar method; medium — combined operations or method selection; hard — complex reasoning, algorithm design, or data analysis.', '']
    for exam_id in sorted(catalog['inventory']):
        lines += ['## ' + exam_id, '', '| Task | Topics | Difficulty | Rationale |', '| --- | --- | --- | --- |']
        ordered = sorted(((key, data) for key, (data, _) in catalog['tasks'].items() if catalog['parents'][data['parentId']][0]['examId'] == exam_id), key=lambda pair: tuple(map(int, pair[1]['number'].split('.'))))
        for task_id, meta in ordered:
            clean = lambda text: text.replace('|', '\\|').replace('\n', ' ')
            lines.append(f"| [{meta['number']}. {clean(meta['title'])}](/zadania/{task_id}/) | {', '.join(names[topic] for topic in meta['topics'])} | {levels[meta['difficulty']]} | {clean(meta['rationale'])} |")
            if meta.get('editorialNote'):
                lines.append(f"| Note {meta['number']} | {clean(meta['editorialNote'])} | | |")
        lines.append('')
    output = root / '.tools/task-reports/task-review.md'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['validate', 'review', 'grading-review'], nargs='?', default='validate')
    args = parser.parse_args()
    if args.command == 'grading-review':
        write_grading_report(ROOT, validate())
        print('Wrote .tools/task-reports/task-grading-report.md')
    elif args.command == 'review':
        write_review()
        print('Wrote .tools/task-reports/task-review.md')
    else:
        catalog = validate()
        print(f"Baza zadań poprawna: {len(catalog['tasks'])} podpunktów, {len(catalog['inventory'])} egzaminów")
