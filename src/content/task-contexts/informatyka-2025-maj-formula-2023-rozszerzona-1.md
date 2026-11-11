---
{
  "examId": "informatyka-2025-maj-formula-2023-rozszerzona",
  "number": "1",
  "title": "Funkcja rekurencyjna",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    4
  ]
}
---

<p>Dana jest rekurencyjna funkcja <em>przestaw</em>, której parametrem jest nieujemna liczba całkowita:</p>
<pre><code>przestaw(n):
    r ← n mod 100
    a ← r div 10
    b ← r mod 10
    n ← n div 100
    jeżeli n &gt; 0
        w ← a + 10 * b + 100 * przestaw(n)
    w przeciwnym razie
        jeżeli a &gt; 0
            w ← a + 10 * b
        w przeciwnym razie
            w ← b
    wynikiem jest w</code></pre>
<p><strong>Uwaga:</strong> Operator mod oznacza resztę z dzielenia, natomiast div – część całkowitą z dzielenia.</p>
