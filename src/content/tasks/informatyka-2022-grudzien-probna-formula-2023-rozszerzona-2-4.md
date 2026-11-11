---
{
  "parentId": "informatyka-2022-grudzien-probna-formula-2023-rozszerzona-2",
  "number": "2.4",
  "title": "Osiągalność między punktami",
  "summary": "Znajdź pary punktów połączone drogą zgodną ze zwrotem strzałek.",
  "points": 3,
  "topics": [
    "rekurencja",
    "wyszukiwanie",
    "pliki"
  ],
  "difficulty": 3,
  "rationale": "Trzeba zaprojektować test osiągalności między punktami i zastosować go do tysiąca par.",
  "sheetPages": [
    6,
    7
  ],
  "gradingPages": [
    6
  ],
  "dataFiles": [
    "Dane_2212/pary.txt"
  ],
  "dependencies": []
}
---

W pliku **pary.txt** danych jest 1000 par liczb całkowitych z przedziału [1, 100 000], po jednej parze w wierszu. Liczby w każdym wierszu są rozdzielone znakiem odstępu. Druga liczba w parze zawsze jest większa od pierwszej.

Dla N = 100 000 wykonano polecenie rysuj(1) dla pewnego układu N punktów.

Napisz program, który znajdzie i wypisze te pary liczb z pliku **pary.txt**, które odpowiadają numerom punktów x i y takich, że z punktu o numerze x można przejść po jednej lub wielu strzałkach (zawsze zgodnie z ich zwrotami) do punktu o numerze y.

Przykład: Przykładowo: dla N = 5 po strzałkach można przejść z punktu o numerze 1 do punktu o numerze 4, ale nie można przejść z punktu o numerze 3 do punktu o numerze 5.

Do oceny oddajesz plik **wyniki2.txt**, zawierający odpowiedź do zadania 2.4., oraz plik(-i) zawierający(-e) kody źródłowe Twojego(-ich) programu(-ów). Brak tych plików jest równoznaczny z brakiem rozwiązania zadania.

<div class="practice-answer-slots" data-practice-editorial>
<p class="practice-note">Każdą parę zapisz jako x y, a kolejne pary oddziel średnikiem. Kolejność par jest dowolna.</p>
<div data-practice="lista">Pary x y, oddzielone średnikami: …</div>
</div>
