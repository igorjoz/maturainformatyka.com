---
{
  "parentId": "informatyka-2022-grudzien-probna-formula-2023-rozszerzona-1",
  "number": "1.2",
  "title": "Koniec pierwszego seta",
  "summary": "Znajdź moment zakończenia seta zgodnie z warunkami punktowymi.",
  "points": 3,
  "topics": [
    "napisy",
    "analiza-i-symulacja",
    "warunki-i-petle",
    "pliki"
  ],
  "difficulty": 2,
  "rationale": "Łączy dwa liczniki punktów z warunkiem minimalnego wyniku i przewagi.",
  "sheetPages": [
    4
  ],
  "gradingPages": [
    3
  ],
  "dataFiles": [
    "Dane_2212/mecz.txt",
    "Dane_2212/mecz_przyklad.txt"
  ],
  "dependencies": []
}
---

Pierwszy set w meczu trwa do pierwszej rozgrywki, po której któraś z drużyn ma co najmniej 1000 punktów za wygranie dotychczasowych rozgrywek, natomiast drużyna przeciwna ma co najmniej 3 punkty mniej. Drużyna, która zdobywa w secie więcej punktów od przeciwnej, wygrywa pierwszego seta.

Przykład: pierwszy set może się zakończyć wynikami: 1000:500, 997:1000, 1500:1497. Wyniki 900:100, 999:1000, 1500:1500 nie kończą seta.

Podaj, która drużyna wygrała pierwszego seta i jaki w tym momencie był wynik (liczba zwycięskich rozgrywek drużyny A i liczba zwycięskich rozgrywek drużyny B w pierwszym secie).

Dla pliku **mecz_przyklad.txt** odpowiedzią jest: **A 1000:5**.

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="druzyna">Drużyna, która wygrała pierwszy set: …</div>
<div data-practice="punkty-a">Punkty drużyny A: …</div>
<div data-practice="punkty-b">Punkty drużyny B: …</div>
</div>
