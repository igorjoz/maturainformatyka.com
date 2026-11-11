---
{
  "parentId": "informatyka-2022-grudzien-probna-formula-2023-rozszerzona-3",
  "number": "3.3",
  "title": "Rozkłady Goldbacha",
  "summary": "Zlicz różne przedstawienia liczby jako sumy dwóch liczb pierwszych.",
  "points": 4,
  "topics": [
    "algorytmy-liczbowe",
    "wyszukiwanie",
    "pliki"
  ],
  "difficulty": 3,
  "rationale": "Wymaga sprawnego wyszukiwania par liczb pierwszych oraz uniknięcia podwójnego zliczania.",
  "sheetPages": [
    8
  ],
  "gradingPages": [
    8,
    9
  ],
  "dataFiles": [
    "Dane_2212/liczby.txt",
    "Dane_2212/liczby_przyklad.txt"
  ],
  "dependencies": []
}
---

Hipoteza Goldbacha głosi, że każda liczba parzysta większa od 2 jest sumą dwóch liczb pierwszych. Nie wiemy, czy ta hipoteza jest prawdziwa dla wszystkich liczb parzystych dodatnich, ale została potwierdzona dla wszystkich liczb „rozsądnej wielkości”, zwłaszcza dla nie przekraczających 10<sup>18</sup>. Oczywiście liczba może mieć więcej niż jeden rozkład na sumę dwóch liczb pierwszych, np. 22 = 19 + 3 = 17 + 5 = 11 + 11.

Dla każdej z liczb z pliku **liczby.txt** rozstrzygnij, na ile różnych sposobów da się ją przedstawić jako sumę dwóch liczb pierwszych.

Podaj:

- liczbę, która ma najwięcej różnych rozkładów na sumę dwóch liczb pierwszych, oraz liczbę takich rozkładów
- liczbę, która ma najmniej różnych rozkładów na sumę dwóch liczb pierwszych, oraz liczbę takich rozkładów.

Uwaga: przyjmujemy, że dwa rozkłady są różne, jeśli nie zawierają takiej samej pary składników. Przykładowo: rozkłady 22 = 19 + 3 i 22 = 3 + 19 są takie same.

Dla pliku **liczby_przyklad.txt** odpowiedzią jest: **996 37 4 1** (liczba 996 ma 37 rozkładów, a 4 tylko jeden).

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="wynik-1">Liczba z największą liczbą rozkładów: …</div>
<div data-practice="wynik-2">Największa liczba rozkładów: …</div>
<div data-practice="wynik-3">Liczba z najmniejszą liczbą rozkładów: …</div>
<div data-practice="wynik-4">Najmniejsza liczba rozkładów: …</div>
</div>
