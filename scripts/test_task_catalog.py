import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

from task_catalog import validate


class TaskCatalogValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.exam_id = 'example-exam'
        self.task_id = 'example-exam-1-1'
        self.original_data = b'1\r\n2\r\n'
        for directory in ['src/data', 'src/content/tasks', 'src/content/task-contexts', 'src/content/task-grading', 'docs/task-inventory', 'docs/task-grading-inventory', 'public/source', 'public/pliki/zadania/example-exam/Dane']:
            (self.root / directory).mkdir(parents=True)
        self.write_json('src/data/task-topics.json', [{'id': 'napisy', 'name': 'Napisy', 'section': 'programowanie'}])
        (self.root / 'public/source/sheet.pdf').write_bytes(b'%PDF-sheet')
        (self.root / 'public/source/grading.pdf').write_bytes(b'%PDF-grading')
        with zipfile.ZipFile(self.root / 'public/source/data.zip', 'w') as archive:
            archive.writestr('Dane/liczby.txt', self.original_data)
        (self.root / 'public/pliki/zadania/example-exam/Dane/liczby.txt').write_bytes(self.original_data)
        self.files = [{'kind': kind, 'path': '/source/' + name, 'sha256': hashlib.sha256((self.root / 'public/source' / name).read_bytes()).hexdigest()} for kind, name in [('sheet','sheet.pdf'),('grading','grading.pdf'),('data','data.zip')]]
        self.write_json('src/data/exams.json', [{'id': self.exam_id, 'formula': '2023', 'files': self.files}])
        self.original = {'number': '1.1', 'points': 2, 'sheetPages': [2], 'gradingPages': [3]}
        self.inventory = {'examId': self.exam_id, 'sheetPages': 5, 'gradingPages': 5, 'sourceSha256': {file['kind']: file['sha256'] for file in self.files if file['kind'] != 'data'}, 'tasks': [self.original]}
        self.write_json('docs/task-inventory/example-exam.json', self.inventory)
        self.parent = {'examId': self.exam_id, 'number': '1', 'title': 'Przykład', 'sheetFile': 'sheet.pdf', 'gradingFile': 'grading.pdf', 'sheetPages': [2]}
        self.meta = {**self.original, 'parentId': 'example-exam-1', 'title': 'Liczby', 'summary': 'Przeanalizuj dane wejściowe.', 'difficulty': 1, 'topics': ['napisy'], 'rationale': 'Pojedyncza operacja.', 'dependencies': [], 'dataFiles': ['Dane/liczby.txt']}
        self.write_entry('task-contexts', 'example-exam-1', self.parent)
        self.write_entry('tasks', self.task_id, self.meta)
        self.grading_meta = {'answerStatus': 'provided'}
        self.grading_body = '## Odpowiedź CKE\n\n42\n\n## Zasady oceniania CKE\n\n2 pkt – poprawna odpowiedź.\n0 pkt – błędna odpowiedź.'
        self.write_entry('task-grading', self.task_id, self.grading_meta, self.grading_body)
        self.grading_inventory = {'examId': self.exam_id, 'sourceSha256': self.files[1]['sha256'], 'tasks': [{'id': self.task_id, 'answerStatus': 'provided', 'gradingPages': [3], 'answerVariants': 1, 'hasTables': False, 'hasCode': False, 'hasFigures': False}]}
        self.write_json('docs/task-grading-inventory/example-exam.json', self.grading_inventory)

    def tearDown(self):
        self.temp.cleanup()

    def write_json(self, path, data):
        (self.root / path).write_text(json.dumps(data), encoding='utf-8')

    def write_entry(self, collection, id, data, body='Pełne polecenie zadania do samodzielnego rozwiązania.'):
        (self.root / 'src/content' / collection / (id + '.md')).write_text('---\n' + json.dumps(data) + '\n---\n' + body, encoding='utf-8')

    def validate(self):
        return validate(self.root, {self.exam_id})

    def test_valid_catalog_preserves_original_file_bytes(self):
        self.assertEqual(len(self.validate()['tasks']), 1)

    def test_missing_subtask_is_rejected(self):
        (self.root / 'src/content/tasks' / (self.task_id + '.md')).unlink()
        with self.assertRaisesRegex(ValueError, 'Niezgodność podpunktów'):
            self.validate()

    def test_duplicate_inventory_subtask_is_rejected(self):
        self.inventory['tasks'].append(copy.deepcopy(self.original))
        self.write_json('docs/task-inventory/example-exam.json', self.inventory)
        with self.assertRaisesRegex(ValueError, 'Powtórzony podpunkt'):
            self.validate()

    def test_unknown_topic_is_rejected(self):
        self.meta['topics'] = ['nieznany']
        self.write_entry('tasks', self.task_id, self.meta)
        with self.assertRaisesRegex(ValueError, 'Nieznany/powtórzony temat'):
            self.validate()

    def test_changed_points_or_pages_are_rejected(self):
        for field, value in [('points', 5), ('sheetPages', [4]), ('gradingPages', [4])]:
            with self.subTest(field=field):
                modified = {**self.meta, field: value}
                self.write_entry('tasks', self.task_id, modified)
                with self.assertRaisesRegex(ValueError, 'Niezgodność'):
                    self.validate()

    def test_source_change_requires_review(self):
        self.inventory['sourceSha256']['sheet'] = 'changed'
        self.write_json('docs/task-inventory/example-exam.json', self.inventory)
        with self.assertRaisesRegex(ValueError, 'Nieaktualna inwentaryzacja'):
            self.validate()

    def test_out_of_bounds_physical_page_is_rejected(self):
        self.inventory['sheetPages'] = 1
        self.write_json('docs/task-inventory/example-exam.json', self.inventory)
        with self.assertRaisesRegex(ValueError, 'Błędne strony PDF'):
            self.validate()

    def test_modified_download_is_rejected(self):
        (self.root / 'public/pliki/zadania/example-exam/Dane/liczby.txt').write_bytes(b'1\n2\n')
        with self.assertRaisesRegex(ValueError, 'Plik danych różni się'):
            self.validate()

    def test_missing_figure_is_rejected(self):
        self.write_entry('tasks', self.task_id, self.meta, 'Polecenie do samodzielnego rozwiązania. <img src="/missing.png" alt="Schemat" />')
        with self.assertRaisesRegex(ValueError, 'Brak pliku'):
            self.validate()

    def test_missing_or_cyclic_dependency_is_rejected(self):
        for dep in ['missing', self.task_id]:
            self.meta['dependencies'] = [dep]
            self.write_entry('tasks', self.task_id, self.meta)
            with self.assertRaisesRegex(ValueError, 'Błędna zależność'):
                self.validate()

    def test_archive_path_traversal_is_rejected(self):
        self.meta['dataFiles'] = ['../outside.txt']
        self.write_entry('tasks', self.task_id, self.meta)
        with self.assertRaisesRegex(ValueError, 'Niebezpieczna ścieżka'):
            self.validate()


    def test_missing_grading_document_is_not_an_unavailable_answer(self):
        (self.root / 'src/content/task-grading' / (self.task_id + '.md')).unlink()
        with self.assertRaisesRegex(ValueError, 'Niekompletne ocenianie'):
            self.validate()

    def test_duplicate_grading_document_is_rejected(self):
        nested = self.root / 'src/content/task-grading/nested'
        nested.mkdir()
        source = self.root / 'src/content/task-grading' / (self.task_id + '.md')
        (nested / source.name).write_bytes(source.read_bytes())
        with self.assertRaisesRegex(ValueError, 'Powtórzony dokument oceniania'):
            self.validate()

    def test_orphan_grading_document_is_rejected(self):
        self.write_entry('task-grading', 'unknown', self.grading_meta, self.grading_body)
        with self.assertRaisesRegex(ValueError, 'Niekompletne ocenianie'):
            self.validate()

    def test_answer_and_criteria_must_both_be_nonempty(self):
        for body in [self.grading_body.replace('42', '<p></p>'), self.grading_body.replace('42', '&nbsp;'), '## Odpowiedź CKE\n42\n## Zasady oceniania CKE\n<!-- empty -->']:
            self.write_entry('task-grading', self.task_id, self.grading_meta, body)
            with self.assertRaisesRegex(ValueError, 'Brak odpowiedzi CKE|Brak kryteriów'):
                self.validate()

    def test_explicit_source_without_answer_is_valid(self):
        self.grading_meta['answerStatus'] = 'not-provided'
        self.grading_inventory['tasks'][0].update(answerStatus='not-provided', answerVariants=0)
        self.write_json('docs/task-grading-inventory/example-exam.json', self.grading_inventory)
        self.write_entry('task-grading', self.task_id, self.grading_meta, '## Zasady oceniania CKE\n\n2 pkt – spełnienie kryterium. 0 pkt – brak odpowiedzi.')
        self.assertEqual(self.validate()['grading']['entries'][self.task_id][0]['answerStatus'], 'not-provided')

    def test_unavailable_status_cannot_conceal_answer_content(self):
        self.grading_meta['answerStatus'] = 'not-provided'
        self.write_entry('task-grading', self.task_id, self.grading_meta, self.grading_body)
        with self.assertRaisesRegex(ValueError, 'Błędne sekcje oceniania'):
            self.validate()

    def test_grading_status_must_be_explicit(self):
        self.write_entry('task-grading', self.task_id, {}, self.grading_body)
        with self.assertRaisesRegex(ValueError, 'Niepoprawny status'):
            self.validate()

    def test_changed_actual_grading_pdf_is_rejected(self):
        (self.root / 'public/source/grading.pdf').write_bytes(b'changed-source')
        with self.assertRaisesRegex(ValueError, 'Zmienione źródło oceniania'):
            self.validate()

    def test_wrong_grading_source_hash_is_rejected(self):
        self.grading_inventory['sourceSha256'] = 'changed'
        self.write_json('docs/task-grading-inventory/example-exam.json', self.grading_inventory)
        with self.assertRaisesRegex(ValueError, 'Zmienione źródło oceniania'):
            self.validate()

    def test_grading_manifest_page_mismatch_is_rejected(self):
        self.grading_inventory['tasks'][0]['gradingPages'] = [4]
        self.write_json('docs/task-grading-inventory/example-exam.json', self.grading_inventory)
        with self.assertRaisesRegex(ValueError, 'Strony niezgodne'):
            self.validate()

    def test_missing_grading_figure_is_rejected(self):
        self.grading_inventory['tasks'][0]['hasFigures'] = True
        self.write_json('docs/task-grading-inventory/example-exam.json', self.grading_inventory)
        self.write_entry('task-grading', self.task_id, self.grading_meta, self.grading_body.replace('42', '<img src="/missing.png" alt="Wykres CKE" />'))
        with self.assertRaisesRegex(ValueError, 'Brak lokalnej ilustracji oceniania'):
            self.validate()


if __name__ == '__main__':
    unittest.main()
