---
{
  "examId": "informatyka-2026-maj-formula-2023-rozszerzona",
  "number": "1",
  "title": "Rekurencja",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    4
  ]
}
---

<p>Dana jest zdefiniowana rekurencyjnie funkcja A(m, n), gdzie m i n są dodatnimi liczbami całkowitymi.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><math display="block"><mrow><mi>A</mi><mo stretchy="false">(</mo><mi>m</mi><mo>,</mo><mi>n</mi><mo stretchy="false">)</mo><mo>=</mo><mo>{</mo><mtable columnalign="left"><mtr><mtd><mi>m</mi></mtd><mtd><mtext>gdy n = 1</mtext></mtd></mtr><mtr><mtd><mi>A</mi><mo stretchy="false">(</mo><mn>2</mn><mo>·</mo><mi>m</mi><mo>,</mo><mfrac><mi>n</mi><mn>2</mn></mfrac><mo stretchy="false">)</mo></mtd><mtd><mtext>gdy n &gt; 1 oraz n jest podzielne przez 2</mtext></mtd></mtr><mtr><mtd><mn>2</mn><mo>·</mo><mi>A</mi><mo stretchy="false">(</mo><mi>m</mi><mo>,</mo><mfrac><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow><mn>2</mn></mfrac><mo stretchy="false">)</mo><mo>+</mo><mi>m</mi></mtd><mtd><mtext>gdy n &gt; 1 oraz n nie jest podzielne przez 2</mtext></mtd></mtr></mtable></mrow></math></div>
