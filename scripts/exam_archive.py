#!/usr/bin/env python3
"""Import official exam files explicitly; validate the local archive without network."""
import argparse
import concurrent.futures
import hashlib
import io
import json
from pathlib import Path
import re
import sys
import urllib.parse
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FORMULAS = {'2023', '2015', 'starsza'}
KINDS = {'glowny', 'dodatkowy', 'probny', 'pokazowy'}
FILE_KINDS = {'sheet', 'grading', 'data', 'extra'}


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)


def official_url(value):
    url = urllib.parse.urlsplit(value)
    host = (url.hostname or '').lower()
    return url.scheme == 'https' and (host in {'cke.gov.pl', 'www.cke.gov.pl', 'bip.cke.gov.pl', 'egzaminy.gov.pl'} or re.fullmatch(r'(?:www\.)?oke\.[a-z]+\.pl', host))


def validate_sources(sources):
    ids, slugs = set(), set()
    if not sources:
        raise ValueError('Katalog źródeł jest pusty')
    for exam in sources:
        for field, values in [('id', ids), ('slug', slugs)]:
            value = exam[field]
            if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', value) or value in values:
                raise ValueError(f'Niepoprawny lub powtórzony {field}: {value}')
            values.add(value)
        if exam['formula'] not in FORMULAS or exam['kind'] not in KINDS or exam['level'] not in {'podstawowy', 'rozszerzony'}:
            raise ValueError(f'Niepoprawna klasyfikacja: {exam["id"]}')
        if not isinstance(exam['year'], int) or not 2005 <= exam['year'] <= 2100 or not 0 <= exam['month'] <= 12:
            raise ValueError(f'Niepoprawna data: {exam["id"]}')
        if not exam['sourcePages'] or not all(official_url(url) for url in exam['sourcePages']):
            raise ValueError(f'Wymagane oficjalne źródło HTTPS: {exam["id"]}')
        names = set()
        for file in exam['files']:
            if file['kind'] not in FILE_KINDS or not official_url(file['url']):
                raise ValueError(f'Niepoprawny rodzaj lub źródło: {file}')
            original_name = urllib.parse.unquote(urllib.parse.urlsplit(file['url']).path).rsplit('/', 1)[-1].lower()
            if file['kind'] in {'sheet', 'data'} and (
                re.search(r'^[me]inp[-_]r[012][-_](?:200|300|400|660|700|q00|z00)[-_]', original_name)
                or re.search(r'^min[-_]r[12]_[23467]p', original_name)
                or re.search(r'^a[23467]informat', original_name)
                or re.search(r'_a[23467]_(?:wb|braille)', original_name)
            ):
                raise ValueError(f'Wariant dostosowany w katalogu standardowym: {file["url"]}')
            name = file['filename']
            if not re.fullmatch(r'[a-z0-9][a-z0-9.-]*\.(pdf|zip|rar)', name) or name in names:
                raise ValueError(f'Niepoprawna lub powtórzona nazwa pliku: {name}')
            names.add(name)
        for requirement in exam['required']:
            if requirement['kind'] not in FILE_KINDS or not requirement['label']:
                raise ValueError(f'Niepoprawne wymaganie: {exam["id"]}')


def inspect_file(data, suffix):
    if suffix == '.pdf':
        if not data.startswith(b'%PDF-') or b'%%EOF' not in data[-4096:]:
            raise ValueError('Niepoprawny PDF (nagłówek lub zakończenie)')
    elif suffix == '.zip':
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            if not archive.namelist() or archive.testzip() is not None:
                raise ValueError('Puste lub uszkodzone archiwum ZIP')
    elif suffix == '.rar':
        if not data.startswith((b'Rar!\x1a\x07\x00', b'Rar!\x1a\x07\x01\x00')):
            raise ValueError('Niepoprawny nagłówek RAR')
    else:
        raise ValueError(f'Nieobsługiwany format: {suffix}')


def metadata(path, root, kind, label, source=None, part=None):
    data = path.read_bytes()
    inspect_file(data, path.suffix)
    result = {'kind': kind, 'label': label, 'path': '/' + path.relative_to(root / 'public').as_posix(),
              'source': source, 'size': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
    if part is not None:
        result['part'] = part
    return result


def missing_files(source, files):
    return [item['label'] for item in source['required'] if not any(
        file['kind'] == item['kind'] and (item.get('part') is None or file.get('part') == item['part']) for file in files)]


def build_bundle(exam, root):
    directory = root / 'public' / 'pliki' / 'matury' / exam['slug']
    path = directory / 'zestaw.zip'
    temporary = path.with_suffix('.tmp')
    with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for file in exam['files']:
            info = zipfile.ZipInfo(Path(file['path']).name, date_time=(2000, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info, (root / 'public' / file['path'].lstrip('/')).read_bytes())
    temporary.replace(path)
    return metadata(path, root, 'bundle', 'Dostępne pliki ZIP' if exam['missing'] else 'Cały zestaw ZIP')


def import_archive(root, refresh=False):
    sources = read_json(root / 'src/data/exam-sources.json')
    validate_sources(sources)
    catalog_path = root / 'src/data/exams.json'
    previous = read_json(catalog_path) if catalog_path.exists() else []
    known = {file['path']: file for exam in previous for file in exam['files']}

    def download(job):
        exam, source = job
        path = root / 'public/pliki/matury' / exam['slug'] / source['filename']
        path.parent.mkdir(parents=True, exist_ok=True)
        public_path = '/' + path.relative_to(root / 'public').as_posix()
        old = known.get(public_path)
        if not refresh and path.exists() and old and hashlib.sha256(path.read_bytes()).hexdigest() != old['sha256']:
            raise ValueError(f'Zmieniony lokalny plik: {public_path}. Sprawdź go przed ponownym importem.')
        try:
            if refresh or not path.exists() or (old and old['source'] != source['url']):
                url = urllib.parse.quote(source['url'], safe=':/?=&%+,')
                request = urllib.request.Request(url, headers={'User-Agent': 'MaturaInformatyka-Archive/1.0'})
                with urllib.request.urlopen(request, timeout=60) as response:
                    if not official_url(response.url):
                        raise ValueError('Przekierowanie poza oficjalne źródła')
                    data = response.read()
                inspect_file(data, path.suffix)
                temporary = path.with_suffix(path.suffix + '.part')
                temporary.write_bytes(data)
                temporary.replace(path)
            result = metadata(path, root, source['kind'], source['label'], source['url'], source.get('part'))
            if not refresh and old and old['source'] == source['url'] and old['sha256'] != result['sha256']:
                raise ValueError('Suma kontrolna lokalnego pliku uległa zmianie; sprawdź plik przed ponownym importem')
            return exam['id'], result, None
        except Exception as error:
            return exam['id'], None, {'url': source['url'], 'label': source['label'], 'error': str(error)}

    jobs = [(exam, file) for exam in sources for file in exam['files']]
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for index, (exam_id, file, error) in enumerate(pool.map(download, jobs), 1):
            entry = results.setdefault(exam_id, {'files': [], 'errors': []})
            entry['errors' if error else 'files'].append(error or file)
            if index % 20 == 0:
                print(f'Przetworzono {index}/{len(jobs)} plików', flush=True)
    catalog, report = [], []
    for source in sources:
        result = results.get(source['id'], {'files': [], 'errors': []})
        missing = missing_files(source, result['files'])
        report.append({'id': source['id'], 'files': len(result['files']), 'missing': missing, 'errors': result['errors']})
        if not result['files']:
            continue
        exam = {key: value for key, value in source.items() if key not in {'files', 'required'}}
        exam.update(files=result['files'], missing=missing)
        exam['bundle'] = build_bundle(exam, root)
        catalog.append(exam)
    write_json(catalog_path, catalog)
    write_json(root / 'docs/exam-import-report.json', {'sources': len(sources), 'published': len(catalog), 'sets': report})
    print(f'Zaimportowano {len(catalog)} zestawów. Raport: docs/exam-import-report.json')


def validate_archive(root):
    sources = read_json(root / 'src/data/exam-sources.json')
    validate_sources(sources)
    catalog = read_json(root / 'src/data/exams.json')
    source_by_id = {exam['id']: exam for exam in sources}
    seen_ids, seen_slugs = set(), set()
    count = 0
    for exam in catalog:
        if exam['id'] in seen_ids or exam['slug'] in seen_slugs:
            raise ValueError(f'Powtórzony zestaw: {exam["id"]}')
        seen_ids.add(exam['id'])
        seen_slugs.add(exam['slug'])
        source = source_by_id[exam['id']]
        for key in ['slug', 'formula', 'formulaLabel', 'year', 'month', 'kind', 'level', 'sessionLabel', 'sourcePages']:
            if exam[key] != source[key]:
                raise ValueError(f'Niezgodne metadane {key}: {exam["id"]}')
        if not exam['files'] or exam['missing'] != missing_files(source, exam['files']):
            raise ValueError(f'Niezgodny opis braków: {exam["id"]}')
        paths = set()
        for file in [*exam['files'], exam['bundle']]:
            prefix = '/pliki/matury/' + exam['slug'] + '/'
            if not file['path'].startswith(prefix) or '/' in file['path'][len(prefix):] or file['path'] in paths:
                raise ValueError(f'Niepoprawna lub powtórzona ścieżka: {file["path"]}')
            paths.add(file['path'])
            path = root / 'public' / file['path'].lstrip('/')
            actual = metadata(path, root, file['kind'], file['label'], file['source'], file.get('part'))
            if actual != file:
                raise ValueError(f'Niezgodne rozmiar, typ lub suma kontrolna: {file["path"]}')
            if file['kind'] != 'bundle' and not any(
                item['url'] == file['source'] and item['filename'] == path.name and item['kind'] == file['kind'] and
                item['label'] == file['label'] and item.get('part') == file.get('part') for item in source['files']):
                raise ValueError(f'Plik nie pochodzi z deklarowanego źródła: {path}')
            count += 1
        with zipfile.ZipFile(root / 'public' / exam['bundle']['path'].lstrip('/')) as bundle:
            if bundle.namelist() != [Path(file['path']).name for file in exam['files']]:
                raise ValueError(f'Niezgodna lista plików ZIP: {exam["id"]}')
            for file in exam['files']:
                if hashlib.sha256(bundle.read(Path(file['path']).name)).hexdigest() != file['sha256']:
                    raise ValueError(f'Niezgodna zawartość ZIP: {file["path"]}')
    if not catalog:
        raise ValueError('Brak opublikowanych zestawów')
    unpublished = set(source_by_id) - seen_ids
    report = read_json(root / 'docs/exam-import-report.json')
    if any(not any(item['id'] == key and item['files'] == 0 and item['missing'] for item in report['sets']) for key in unpublished):
        raise ValueError('Zestaw pominięty bez wyjaśnienia w raporcie')
    print(f'Poprawne archiwum: {len(catalog)} zestawów, {count} plików (wraz z paczkami ZIP).')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['import', 'validate'])
    parser.add_argument('--refresh', action='store_true', help='Pobierz ponownie pliki i świadomie odśwież sumy kontrolne')
    args = parser.parse_args()
    try:
        if args.command == 'import':
            import_archive(ROOT, args.refresh)
        else:
            validate_archive(ROOT)
    except (ValueError, KeyError, OSError, zipfile.BadZipFile) as error:
        print(f'Błąd archiwum: {error}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
