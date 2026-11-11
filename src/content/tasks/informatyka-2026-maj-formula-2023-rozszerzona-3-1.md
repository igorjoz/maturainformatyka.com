---
{
  "parentId": "informatyka-2026-maj-formula-2023-rozszerzona-3",
  "number": "3.1",
  "title": "Różnica sum kodów ASCII",
  "summary": "Znajdź parę słów o największej bezwzględnej różnicy sum kodów znaków.",
  "points": 2,
  "topics": [
    "napisy",
    "pliki",
    "reprezentacja-danych"
  ],
  "difficulty": 2,
  "rationale": "Łączy sumowanie kodów znaków i wyszukiwanie maksimum dla par słów.",
  "sheetPages": [
    10
  ],
  "gradingPages": [
    7
  ],
  "dataFiles": [
    "Dane-NF-2605/pary.txt",
    "Dane-NF-2605/pary_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>Niech f(s) oznacza sumę kodów ASCII znaków występujących w słowie s. Podaj parę słów s1, s2 występujących w jednym wierszu pliku pary.txt, dla których wartość |f(s1) – f(s2)| (wartość bezwzględna różnicy sum kodów ASCII) jest największa, oraz podaj tę wartość. Jest tylko jedna taka para słów w pliku.</p>

<p>Przykład: Dla pary słów oko i pies, mamy następujące wartości f(oko) = 111 + 107 + 111 = 329 f(pies) = 112 + 105 + 101 + 115 = 433 oraz |f(oko) – f(pies)| = 104.</p>

<p>Dla pliku pary_przyklad.txt poprawną odpowiedzią jest eddcd eededcddceeecededcc 1403</p>

<div class="practice-slots"><div data-practice="slowo1">Pierwsze słowo pary: …</div><div data-practice="slowo2">Drugie słowo pary: …</div><div data-practice="roznica">Wartość bezwzględna różnicy: …</div></div>
