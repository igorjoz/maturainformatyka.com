---
{
  "parentId": "informatyka-2025-maj-formula-2023-rozszerzona-2",
  "number": "2.2",
  "title": "Kwadraty identycznych symboli",
  "summary": "Wyszukaj w danych wszystkie kwadraty 3 × 3 złożone z jednakowych znaków.",
  "points": 4,
  "topics": [
    "tablice-i-ciagi",
    "napisy",
    "pliki",
    "wyszukiwanie"
  ],
  "difficulty": 3,
  "rationale": "Łączy analizę dwuwymiarowych danych, sąsiedztwa i poprawne indeksowanie.",
  "sheetPages": [
    8,
    9
  ],
  "gradingPages": [
    5,
    6
  ],
  "dataFiles": [
    "dane maj 23/symbole.txt",
    "dane maj 23/symbole_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>W pliku symbole.txt szukamy „kwadratów” złożonych z dziewięciu sąsiadujących identycznych symboli:</p><pre><code>+ + +       o o o       * * *
+ + +  lub  o o o  lub  * * *
+ + +       o o o       * * *</code></pre><p>Podaj, ile takich kwadratów występuje w pliku symbole.txt. Jeżeli w pliku występuje jeden taki kwadrat, podaj numer wiersza i numer pozycji w wierszu (licząc od 1) jego środkowego pola. Jeżeli jest więcej takich kwadratów, podaj numer wiersza i numer pozycji w wierszu dla środkowego pola każdego z nich.</p><p>Przykład:</p><p>Poniżej podano 6 wierszy przykładowych danych (po 12 znaków w każdym wierszu):</p><pre><code>1. + * * + o * o + + * o +
2. + + + o o o o * o * * *
3. + o * o o o o * * + + +
4. * + * o o o o o o + + +
5. o * * o + + + o + + + +
6. o o o o + + * * + * + o</code></pre><p>Mamy tutaj trzy kwadraty złożone z 9 identycznych symboli: pierwszy ma środek w wierszu 3 na pozycji 5, drugi – w wierszu 3 na pozycji 6, a trzeci – w wierszu 4 na pozycji 11.</p><p>Odpowiedź dla pliku symbole_przyklad.txt to</p><pre><code>1 6 3</code></pre><p>(jeden kwadrat, który ma środkowe pole w wierszu 6, na pozycji 3).</p>

<div class="practice-slots"><div data-practice="ile">Liczba kwadratów: …</div><div data-practice="wiersz1">Kwadrat 1 — wiersz środka: …</div><div data-practice="kolumna1">Kwadrat 1 — pozycja środka w wierszu: …</div><div data-practice="wiersz2">Kwadrat 2 — wiersz środka: …</div><div data-practice="kolumna2">Kwadrat 2 — pozycja środka w wierszu: …</div><div data-practice="wiersz3">Kwadrat 3 — wiersz środka: …</div><div data-practice="kolumna3">Kwadrat 3 — pozycja środka w wierszu: …</div></div>
