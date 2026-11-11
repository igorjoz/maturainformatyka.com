"""Validate practice answer keys and generate a local coverage report."""
import hashlib
import json
from pathlib import Path
import re
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]

class Anchors(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.nodes = {}
        self.stack = []
    def handle_starttag(self, tag, attrs):
        node = {'tag': tag, 'children': []}
        if self.stack:
            self.stack[-1]['children'].append(node)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.stack.append(node)
        for name, value in attrs:
            if name == 'data-practice':
                self.ids.append(value)
                if any(ancestor.get('practice') for ancestor in self.stack[:-1]):
                    raise ValueError('Zagnieżdżone kotwice formularza')
                node['practice'] = value
                self.nodes[value] = node
    def handle_endtag(self, tag):
        for index in range(len(self.stack)-1,-1,-1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                break


def validate(root=ROOT):
    def require(condition, message):
        if not condition:
            raise ValueError(message)
    tasks = {p.stem: p for p in (root / 'src/content/tasks').glob('*.md')}
    records = {}
    for path in (root / 'src/data/task-practice').rglob('*.json'):
        record = json.loads(path.read_text())
        task_id = record.get('id')
        require(task_id not in records, f'Powtórzony formularz: {task_id}')
        require(path.stem == task_id, f'Niezgodny identyfikator: {path}')
        records[task_id] = record
    require(set(records) == set(tasks), 'Niekompletna kwalifikacja formularzy')
    for task_id, record in records.items():
        require(record.get('mode') in {'manual','interactive'} and record.get('reason','').strip(), f'Brak kwalifikacji: {task_id}')
        grading = root / 'src/content/task-grading' / (task_id + '.md')
        require(record.get('gradingSha256') == hashlib.sha256(grading.read_bytes()).hexdigest(), f'Zmieniony klucz CKE: {task_id}')
        if record['mode'] == 'manual':
            require(not record.get('fields') and not record.get('variants'), f'Pola w zadaniu manualnym: {task_id}')
            continue
        fields, variants = record.get('fields', []), record.get('variants', [])
        require(0 < len(fields) <= 20 and variants, f'Niepoprawna liczba pól/wariantów: {task_id}')
        ids = [field.get('id') for field in fields]
        require(len(set(ids)) == len(ids), f'Powtórzone pola: {task_id}')
        anchors = Anchors()
        anchors.feed(tasks[task_id].read_text())
        for field in fields:
            key = field['id']
            require(bool(re.fullmatch('[a-z0-9-]+', key)), f'Błędny identyfikator pola: {task_id}')
            require(field.get('target') == f'[data-practice="{key}"]' and anchors.ids.count(key) == 1, f'Brak jednoznacznej kotwicy: {task_id}/{key}')
            require(field.get('kind') in {'number','text','single','multiple'} and field.get('label','').strip(), f'Błędne pole: {task_id}/{key}')
            require(type(field.get('base',10)) is int and 2 <= field.get('base',10) <= 36, f'Błędny system liczbowy: {task_id}')
            options = field.get('options', [])
            values = [option['value'] for option in options]
            if field['kind'] in {'single','multiple'}:
                require(len(values) >= 2 and len(values) == len(set(values)), f'Błędne opcje: {task_id}')
                require(all(option.get('label') and '|' not in option['value'] for option in options), f'Błędne etykiety: {task_id}')
                require(all('selector' in option for option in options) or all('selector' not in option for option in options), f'Mieszane miejsca opcji: {task_id}')
            for option in options:
                if 'selector' in option:
                    match = re.fullmatch(r'([a-z]+):nth-child\((\d+)\)', option['selector'])
                    children = anchors.nodes[key]['children']
                    require(match and 0 < int(match[2]) <= len(children) and children[int(match[2])-1]['tag'] == match[1], f'Brak miejsca opcji: {task_id}/{key}')
            for variant in variants:
                require(set(variant) == set(ids), f'Niekompletny wariant: {task_id}')
                answers = variant[key]
                require(isinstance(answers,list) and answers and all(isinstance(v,str) and v.strip() for v in answers), f'Brak odpowiedzi: {task_id}/{key}')
                if options:
                    require(all(set(answer.split('|')) <= set(values) for answer in answers), f'Odpowiedź spoza opcji: {task_id}')
        total = sum(max(len(value.split(';')) for variant in variants for value in variant[field['id']]) if field.get('unordered') else 1 for field in fields)
        require(total <= 20, f'Przekroczony limit odpowiedzi: {task_id}')
        require(set(anchors.ids) == set(ids), f'Osierocona kotwica: {task_id}')
    return records


def report(records, root=ROOT):
    active = [r for r in records.values() if r['mode'] == 'interactive']
    lines = ['# Practice coverage', '',
             f"Records: {len(records)}. Interactive: {len(active)}. Manual: {len(records)-len(active)}.", '',
             'Generated from practice records. Field labels, reasons, and notes retain their original Polish text. Checks compare answers and do not award marks for methods, code, or charts.', '',
             '| Task | Mode / fields | Comparison and scope |', '| --- | --- | --- |']
    for key, item in sorted(records.items()):
        fields = item.get('fields', [])
        methods = ', '.join(sorted(set(f["kind"] + (' (unordered)' if f.get('unordered') else '') + (f" (base {f['base']})" if f.get('base') else '') for f in fields)))
        description = item['reason'] + ' ' + item.get('note','')
        if methods:
            description += f' Fields: {"; ".join(f["label"] for f in fields)}. Comparison: {methods}; complete variants: {len(item["variants"])}.'
        lines.append(f"| [{key}](/zadania/{key}/) | {'Interactive: ' + str(len(fields)) if fields else 'Manual'} | {description.replace('|', '/').replace(chr(10),' ')} |")
    output = root / '.tools/task-reports/task-practice-report.md'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')

if __name__ == '__main__':
    import sys
    records = validate()
    if '--report' in sys.argv:
        report(records)
        print('Wrote .tools/task-reports/task-practice-report.md')
    print(f'Formularze poprawne: {len(records)} kwalifikacji, {sum(r["mode"] == "interactive" for r in records.values())} interaktywnych')
