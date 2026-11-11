---
{
  "parentId": "informatyka-2023-maj-formula-2023-rozszerzona-3",
  "number": "3.4",
  "title": "Najdłuższy ciąg rosnąco-malejący",
  "summary": "Znajdź najdłuższy odpowiedni fragment cyfr i jego pozycję początkową.",
  "points": 2,
  "topics": [
    "tablice-i-ciagi",
    "wyszukiwanie",
    "pliki"
  ],
  "difficulty": 3,
  "rationale": "Najdłuższy ciąg rosnąco-malejący: wymaga złożonej analizy zależności, konstrukcji rozwiązania lub kontroli wielu warunków.",
  "sheetPages": [
    14
  ],
  "gradingPages": [
    12,
    13
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

<p>Znajdź najdłuższy ciąg kolejnych cyfr z pliku pi.txt, który jest rosnąco-malejący, oraz pozycję, na której on się rozpoczyna. W pliku pi.txt jest tylko jeden taki ciąg o największej długości.</p>

<p>Wynik zapisz w dwóch wierszach: w pierwszym wierszu zapisz pozycję, od której zaczyna się znaleziony ciąg, a w drugim wypisz znaleziony ciąg. Cyfry ciągu zapisz jedną po drugiej, bez znaku odstępu.</p>

<p>Dla danych w pliku pi_przyklad.txt poprawna odpowiedź to 77 0899862 (najdłuższy ciąg rosnąco-malejący w pliku pi_przyklad.txt to ciąg 0899862 o długości 7 rozpoczynający się w 77 wierszu pliku).</p>

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="pozycja">Pozycja początku najdłuższego ciągu: …</div>
<div data-practice="ciag">Cyfry najdłuższego ciągu, bez odstępów: …</div>
</div>
