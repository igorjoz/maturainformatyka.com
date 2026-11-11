---
{
  "parentId": "informatyka-2026-maj-formula-2023-rozszerzona-3",
  "number": "3.2",
  "title": "Wspólne wystąpienia liter",
  "summary": "Porównaj liczebności liter w parach słów i znajdź największą sumę wspólnych wystąpień.",
  "points": 3,
  "topics": [
    "napisy",
    "pliki",
    "tablice-i-ciagi"
  ],
  "difficulty": 2,
  "rationale": "Wymaga zliczania liter, obliczania minimów i porównania wyników.",
  "sheetPages": [
    10,
    11
  ],
  "gradingPages": [
    8
  ],
  "dataFiles": [
    "Dane-NF-2605/pary.txt",
    "Dane-NF-2605/pary_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>Wspólną liczbę wystąpień litery x w słowach s1, s2 oznaczymy przez W(x, s1, s2) i definiujemy jako W(x, s1, s2) = minimum(d(x, s1), d(x, s2))</p>

<p>gdzie d(x, s) oznacza liczbę wystąpień litery x w słowie s.</p>

<p>Podaj parę słów występujących w jednym wierszu w pliku pary.txt, dla której suma wspólnych wystąpień wszystkich liter jest największa, oraz podaj tę sumę. Jest jedna taka para.</p>

<p>Przykład: Dla poniższej pary słów wypisano wspólną liczbę wystąpień wszystkich liter (wyniki wypisano w kolejności alfabetycznej): adabbcdde aadabbbccdc → a: 2, b: 2, c: 1, d: 2, e: 0 Suma wspólnych wystąpień wszystkich liter dla pary z tego przykładu wynosi: 2 + 2 + 1 + 2 = 7.</p>

<p>Dla pliku pary_przyklad.txt poprawną odpowiedzią jest ccccdcedddddecde ccdcdddecc 10</p>

<div class="practice-slots"><div data-practice="slowo1">Pierwsze słowo pary: …</div><div data-practice="slowo2">Drugie słowo pary: …</div><div data-practice="suma">Suma wspólnych wystąpień liter: …</div></div>
