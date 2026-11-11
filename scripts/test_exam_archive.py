"""Validation coverage for corrupt files, metadata, and bundles in an isolated fixture."""
import copy
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

from exam_archive import build_bundle, inspect_file, metadata, validate_archive, validate_sources


class ArchiveValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = {'id': 'test-2023', 'slug': 'test-2023', 'year': 2023, 'month': 5,
                       'formula': '2023', 'formulaLabel': 'Formula 2023', 'kind': 'glowny',
                       'level': 'rozszerzony', 'sessionLabel': 'May',
                       'sourcePages': ['https://cke.gov.pl/arkusze/'],
                       'files': [{'kind': 'sheet', 'label': 'Exam paper', 'filename': 'paper.pdf', 'url': 'https://cke.gov.pl/test.pdf'}],
                       'required': [{'kind': 'sheet', 'label': 'exam paper'}, {'kind': 'data', 'label': 'task data'}]}
        directory = self.root / 'public/pliki/matury/test-2023'
        directory.mkdir(parents=True)
        self.pdf = directory / 'paper.pdf'
        self.pdf.write_bytes(b'%PDF-1.7\nfixture\n%%EOF\n')
        self.exam = {key: copy.deepcopy(value) for key, value in self.source.items() if key not in {'files', 'required'}}
        self.exam.update(files=[metadata(self.pdf, self.root, 'sheet', 'Exam paper', 'https://cke.gov.pl/test.pdf')], missing=['task data'])
        self.exam['bundle'] = build_bundle(self.exam, self.root)
        self.save('src/data/exam-sources.json', [self.source])
        self.save('src/data/exams.json', [self.exam])
        self.save('docs/exam-import-report.json', {'sets': []})

    def save(self, path, value):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(value))

    def test_declared_missing_data_is_valid(self):
        validate_archive(self.root)

    def test_missing_file_fails(self):
        self.pdf.unlink()
        with self.assertRaises(FileNotFoundError):
            validate_archive(self.root)

    def test_changed_pdf_checksum_fails(self):
        self.pdf.write_bytes(b'%PDF-1.7\nchanged\n%%EOF\n')
        with self.assertRaisesRegex(ValueError, 'checksum'):
            validate_archive(self.root)

    def test_duplicate_ids_and_path_traversal_fail(self):
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            validate_sources([self.source, self.source])
        self.source['files'][0]['filename'] = '../paper.pdf'
        with self.assertRaisesRegex(ValueError, 'filename'):
            validate_sources([self.source])

    def test_html_error_page_is_not_a_pdf(self):
        with self.assertRaisesRegex(ValueError, 'PDF'):
            inspect_file(b'<html>404</html>', '.pdf')

    def test_braille_sheet_package_cannot_be_used_as_standard_exam_data(self):
        self.source['files'].append({'kind': 'data', 'label': 'Task data', 'filename': 'data.zip',
                                     'url': 'https://cke.gov.pl/informatyka_A6_WB.zip'})
        with self.assertRaisesRegex(ValueError, 'Adapted variant'):
            validate_sources([self.source])

    def test_missing_status_cannot_hide_a_broken_entry(self):
        self.exam['missing'] = []
        self.save('src/data/exams.json', [self.exam])
        with self.assertRaisesRegex(ValueError, 'Missing-material status'):
            validate_archive(self.root)

    def test_bundle_cannot_include_a_different_pdf_even_with_updated_checksum(self):
        path = self.root / 'public' / self.exam['bundle']['path'].lstrip('/')
        with zipfile.ZipFile(path, 'w') as archive:
            archive.writestr('paper.pdf', b'a different document')
        self.exam['bundle'] = metadata(path, self.root, 'bundle', 'Available files ZIP')
        self.save('src/data/exams.json', [self.exam])
        with self.assertRaisesRegex(ValueError, 'ZIP contents'):
            validate_archive(self.root)

    def test_corrupt_zip_fails_crc_check(self):
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w') as archive:
            archive.writestr('dane.txt', b'12345')
        corrupted = stream.getvalue().replace(b'12345', b'54321')
        with self.assertRaisesRegex(ValueError, 'ZIP'):
            inspect_file(corrupted, '.zip')


if __name__ == '__main__':
    unittest.main()
