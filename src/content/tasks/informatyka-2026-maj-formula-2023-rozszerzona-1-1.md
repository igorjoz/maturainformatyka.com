---
{
  "parentId": "informatyka-2026-maj-formula-2023-rozszerzona-1",
  "number": "1.1",
  "title": "Wywołania funkcji A",
  "summary": "Prześledź argumenty i liczbę wywołań rekurencyjnych funkcji dwóch zmiennych.",
  "points": 3,
  "topics": [
    "rekurencja",
    "analiza-i-symulacja"
  ],
  "difficulty": 2,
  "rationale": "Wymaga śledzenia dwóch gałęzi rekurencji oraz argumentu zapisanego jako potęga.",
  "sheetPages": [
    4
  ],
  "gradingPages": [
    2,
    3
  ],
  "dataFiles": [],
  "dependencies": []
}
---

<p>Obliczenie wartości funkcji A(3, 9) wprost z definicji wymaga trzech wywołań rekurencyjnych: A(3, 4), A(6, 2), A(12, 1), ponieważ:</p><p>A(3, 9) = 2 · A(3, 4) + 3 = 2 · A(6, 2) + 3 = 2 · A(12, 1) + 3 = 2 · 12 + 3 = 27</p><p>Uzupełnij poniższą tabelę. Podaj liczbę wywołań rekurencyjnych funkcji A oraz wypisz wywołania rekurencyjne wraz z ich argumentami (w ostatnim wierszu podaj tylko liczbę wywołań rekurencyjnych).</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">m</th><th scope="col">n</th><th scope="col">liczba wywołań rekurencyjnych funkcji A</th><th scope="col">wywołania rekurencyjne funkcji A</th></tr></thead><tbody><tr><td>3</td><td>9</td><td>3</td><td>A(3, 4), A(6, 2), A(12, 1)</td></tr><tr><td>2<sup>5</sup></td><td>2<sup>5</sup></td><td data-practice="ile32"></td><td data-practice="wywolania32"></td></tr><tr><td>10</td><td>15</td><td data-practice="ile15"></td><td data-practice="wywolania15"></td></tr><tr><td>1</td><td>2<sup>100</sup> + 1</td><td data-practice="ile100"></td><td>—</td></tr></tbody></table></div>
