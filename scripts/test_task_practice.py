import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from task_practice import validate

class PracticeValidationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        for name in ['src/content/tasks','src/content/task-grading','src/data/task-practice']:
            (self.root/name).mkdir(parents=True)
        (self.root/'src/content/tasks/example.md').write_text('<span data-practice="result">…</span>')
        (self.root/'src/content/task-grading/example.md').write_text('Answer: 42')
        self.record = {'id':'example','mode':'interactive','reason':'Unique number','gradingSha256':hashlib.sha256(b'Answer: 42').hexdigest(),'fields':[{'id':'result','kind':'number','label':'Result','target':'[data-practice="result"]'}],'variants':[{'result':['42']}]}
    def tearDown(self):
        self.tmp.cleanup()
    def run_validation(self):
        (self.root/'src/data/task-practice/example.json').write_text(json.dumps(self.record))
        return validate(self.root)
    def test_valid(self):
        self.assertEqual(len(self.run_validation()),1)
    def test_missing_record(self):
        with self.assertRaisesRegex(ValueError,'Niekompletna'):
            validate(self.root)
    def test_changed_source(self):
        self.record['gradingSha256']='old'
        with self.assertRaisesRegex(ValueError,'Zmieniony klucz'):
            self.run_validation()
    def test_missing_anchor(self):
        (self.root/'src/content/tasks/example.md').write_text('Question')
        with self.assertRaisesRegex(ValueError,'kotwicy'):
            self.run_validation()
    def test_nested_anchor(self):
        (self.root/'src/content/tasks/example.md').write_text('<span data-practice="result"><span data-practice="other">…</span></span>')
        with self.assertRaisesRegex(ValueError,'Zagnieżdżone'):
            self.run_validation()
    def test_duplicate_field(self):
        self.record['fields']*=2
        with self.assertRaisesRegex(ValueError,'Powtórzone pola'):
            self.run_validation()
    def test_incomplete_variant(self):
        self.record['variants']=[{'other':['42']}]
        with self.assertRaisesRegex(ValueError,'Niekompletny wariant'):
            self.run_validation()
    def test_unknown_choice(self):
        self.record['fields'][0].update(kind='single',options=[{'value':'A','label':'A'},{'value':'B','label':'B'}])
        with self.assertRaisesRegex(ValueError,'spoza opcji'):
            self.run_validation()
