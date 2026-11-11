"""Exercise deployment pruning with real rsync against a disposable hosting tree."""
from pathlib import Path
import os
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('sync-hostinger-pages.sh')


class DeploymentPagesTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.source = self.root / 'dist'
        self.host = self.root / 'host'
        self.source.mkdir()
        self.host.mkdir()
        self.write(self.source, 'index.html', 'new homepage')

    def write(self, root, relative, content):
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
        if root == self.host:
            os.utime(path, (1, 1))

    def deploy(self, *options):
        return subprocess.run(
            ['bash', str(SCRIPT), str(self.source), str(self.host), '-rt', *options],
            check=True, capture_output=True, text=True,
        ).stdout

    def snapshot(self):
        return {str(path.relative_to(self.host)): path.read_bytes()
                for path in self.host.rglob('*') if path.is_file()}

    def test_withdrawn_articles_and_renamed_routes_are_removed(self):
        for namespace in ['wiedza', 'zadania', 'arkusze']:
            self.write(self.host, f'{namespace}/withdrawn/index.html', 'old content')
            self.write(self.source, f'{namespace}/published/index.html', 'new content')
        self.write(self.host, 'index.html', 'old homepage')
        self.deploy()
        self.assertEqual((self.host / 'index.html').read_text(), 'new homepage')
        for namespace in ['wiedza', 'zadania', 'arkusze']:
            self.assertFalse((self.host / namespace / 'withdrawn/index.html').exists())
            self.assertEqual((self.host / namespace / 'published/index.html').read_text(), 'new content')

    def test_unmanaged_pages_configuration_and_assets_are_preserved(self):
        preserved = ['.htaccess', 'custom/index.html', 'legacy.html', '_astro/old.js',
                     'pliki/material.pdf', 'wiedza/.htaccess', 'wiedza/old/image.png',
                     'wiedza/custom.html', 'zadania/data/input.txt']
        for relative in preserved:
            self.write(self.host, relative, relative)
        self.write(self.host, 'wiedza/old/index.html', 'withdrawn article')
        self.deploy()
        for relative in preserved:
            self.assertEqual((self.host / relative).read_text(), relative)
        self.assertFalse((self.host / 'wiedza/old/index.html').exists())

    def test_dry_run_reports_deletions_without_changing_hosting(self):
        self.write(self.host, 'wiedza/withdrawn/index.html', 'old content')
        self.write(self.source, 'wiedza/published/index.html', 'new content')
        before = self.snapshot()
        output = self.deploy('--dry-run', '--itemize-changes')
        self.assertIn('*deleting', output)
        self.assertIn('withdrawn/index.html', output)
        self.assertEqual(self.snapshot(), before)
        self.assertFalse((self.host / 'arkusze').exists())

    def test_entire_withdrawn_namespace_is_pruned(self):
        self.write(self.host, 'matura-2027/index.html', 'withdrawn guide')
        self.write(self.host, 'matura-2027/image.png', 'retained asset')
        self.deploy()
        self.assertFalse((self.host / 'matura-2027/index.html').exists())
        self.assertEqual((self.host / 'matura-2027/image.png').read_text(), 'retained asset')

    def test_subsequent_release_withdraws_previously_published_page(self):
        article = 'wiedza/example/index.html'
        self.write(self.source, article, 'published content')
        self.deploy()
        self.assertTrue((self.host / article).is_file())
        (self.source / article).unlink()
        self.deploy()
        self.assertFalse((self.host / article).exists())

    def test_missing_build_refuses_to_prune_hosting(self):
        self.write(self.host, 'wiedza/published/index.html', 'keep this page')
        before = self.snapshot()
        (self.source / 'index.html').unlink()
        with self.assertRaises(subprocess.CalledProcessError):
            self.deploy()
        self.assertEqual(self.snapshot(), before)


if __name__ == '__main__':
    unittest.main()
