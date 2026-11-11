---
{
  "examId": "informatyka-2024-maj-formula-2023-rozszerzona",
  "number": "2",
  "title": "Cyfry",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    7
  ]
}
---

<p>Przeanalizuj poniższy algorytm, który dla danej nieujemnej liczby całkowitej n oblicza liczbę całkowitą c.</p>

<pre><code>b ← 1
c ← 0
dopóki n &gt; 0 wykonuj
    a ← n mod 10
    n ← n div 10
    jeżeli (a mod 2 = 0)
        c ← c + b * (a div 2)
    w przeciwnym razie
        c ← c + b
    b ← b * 10</code></pre>

<p>Uwaga: x mod y, x div y oznaczają – odpowiednio – resztę i iloraz z dzielenia całkowitego x przez y.</p>
