"""Exercise the author's publish/draft workflow against actual static build outputs."""
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]

class PublicationBuildTest(unittest.TestCase):
    def test_publication_lifecycle(self):
        directory = ROOT / 'src/content/publications'
        published = directory / 'verification-published.md'
        draft = directory / 'verification-draft.md'
        self.assertFalse(published.exists())
        self.assertFalse(draft.exists())
        template = '''---
title: "Verification article"
description: "A temporary integration test article."
slug: {slug}
section: programowanie
author: Test
publishedAt: "2026-11-11"
updatedAt: "2026-11-11"
draft: {draft}
{extra}
---
## A real heading

```python
print(2 + 2)
```
'''
        def build():
            return subprocess.run(['bash', 'scripts/npm.sh', 'run', 'build'], cwd=ROOT, capture_output=True, text=True)
        try:
            published.write_text(template.format(slug='verification-published', draft='false', extra=''))
            draft.write_text(template.format(slug='verification-draft', draft='true', extra=''))
            result = build()
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertTrue((ROOT/'dist/wiedza/verification-published/index.html').exists())
            self.assertFalse((ROOT/'dist/wiedza/verification-draft/index.html').exists())
            html = (ROOT/'dist/wiedza/verification-published/index.html').read_text()
            self.assertIn('A real heading', html)
            self.assertIn('astro-code', html)
            for filename in ['dist/wiedza/index.html', 'dist/sitemap.xml']:
                content = (ROOT/filename).read_text()
                self.assertIn('/wiedza/verification-published/', content)
                self.assertNotIn('/wiedza/verification-draft/', content)
            published.write_text(template.format(slug='verification-published', draft='false', extra='relatedTasks: [missing-task]'))
            result = build()
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Unknown publication task', result.stdout + result.stderr)
        finally:
            published.unlink(missing_ok=True)
            draft.unlink(missing_ok=True)
            result = build()
            if result.returncode:
                raise RuntimeError(result.stdout + result.stderr)

if __name__ == '__main__':
    unittest.main()
