---
{
  "parentId": "informatyka-2023-maj-formula-2023-rozszerzona-3",
  "number": "3.3",
  "title": "Sześciocyfrowe ciągi rosnąco-malejące",
  "summary": "Zlicz fragmenty o zadanej długości zgodne z definicją ciągu rosnąco-malejącego.",
  "points": 3,
  "topics": [
    "tablice-i-ciagi",
    "analiza-i-symulacja",
    "pliki"
  ],
  "difficulty": 3,
  "rationale": "Sześciocyfrowe ciągi rosnąco-malejące: wymaga złożonej analizy zależności, konstrukcji rozwiązania lub kontroli wielu warunków.",
  "sheetPages": [
    13
  ],
  "gradingPages": [
    11,
    12
  ],
  "dataFiles": [
    "Dane_2305/pi.txt",
    "Dane_2305/pi_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>Informacja do zadań 3.3. i 3.4.</p>

<p>Skończony co najmniej 4-elementowy ciąg liczb (a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>) jest rosnąco-malejący, jeśli można podzielić go na dwa ciągi, z których pierwszy jest rosnący, a drugi – malejący, tzn. jeśli istnieje takie k ∈ {2, 3, …, n – 2}, że a<sub>1</sub> &lt; a<sub>2</sub> &lt; … &lt; a<sub>k</sub> oraz a<sub>k+1</sub> &gt; a<sub>k+2</sub> &gt; … &gt; a<sub>n</sub>.</p>

<p>Przykład: Ciąg (2, 5, 7, 9, 8, 3, 1) jest rosnąco-malejący, bo można go podzielić na dwa ciągi: rosnący (2, 5, 7) i malejący (9, 8, 3, 1) lub – odpowiednio – (2, 5, 7, 9) i (8, 3, 1). Ciąg (5, 9, 9, 4,1) także jest rosnąco-malejący. Przykłady ciągów, które nie są rosnąco-malejące, to: (2, 5, 8, 4, 3, 4, 5), (1, 2, 3, 4), (5, 5, 3, 2, 1).</p>

<p>Podaj, ile jest wszystkich rosnąco-malejących ciągów złożonych z dokładnie sześciu kolejnych cyfr zapisanych w pliku pi.txt.</p>

<p>Dla pliku pi_przyklad.txt poprawna odpowiedź to 3. (w pliku pi_przyklad.txt są trzy ciągi rosnąco-malejące złożone z dokładnie sześciu cyfr: 028841, 089986, 899862)</p>

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="wynik-1">Liczba sześciocyfrowych ciągów rosnąco-malejących: …</div>
</div>
