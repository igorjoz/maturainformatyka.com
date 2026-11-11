---
{
  "parentId": "informatyka-2026-maj-formula-2023-rozszerzona-1",
  "number": "1.3",
  "title": "Rekurencja dla potęg dwójki",
  "summary": "Uogólnij liczbę wywołań i postać argumentów dla liczb 2 do potęgi k oraz 2 do potęgi k minus 1.",
  "points": 3,
  "topics": [
    "rekurencja",
    "zlozonosc",
    "algorytmy-liczbowe"
  ],
  "difficulty": 3,
  "rationale": "Wymaga wyprowadzenia ogólnego wzoru zależnego od k i numeru wywołania.",
  "sheetPages": [
    6
  ],
  "gradingPages": [
    4
  ],
  "dataFiles": [],
  "dependencies": []
}
---

<p>Uzupełnij tabelę. W drugiej kolumnie podaj liczbę wywołań rekurencyjnych funkcji A dla każdej wartości n podanej w tabeli (drugiego argumentu wywołania funkcji, pierwszy jest nieistotny w tym zadaniu). W trzeciej kolumnie podaj wyrażenie, którego wartość jest równa drugiemu argumentowi funkcji w i-tym wywołaniu rekurencyjnym dla wszystkich wartości i większych bądź równych 1 i mniejszych bądź równych całkowitej liczbie wywołań.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">n – drugi argument wywołania funkcji</th><th scope="col">liczba wywołań rekurencyjnych</th><th scope="col">wartość drugiego argumentu A w i-tym wywołaniu rekurencyjnym</th></tr></thead><tbody><tr><td>8</td><td>3</td><td><math><mfrac><mn>8</mn><msup><mn>2</mn><mi>i</mi></msup></mfrac></math> (lub 2<sup>3 − i</sup>)</td></tr><tr><td>2<sup>k</sup></td><td></td><td></td></tr><tr><td>2<sup>k</sup> − 1</td><td></td><td></td></tr></tbody></table></div><p>gdzie k jest pewną liczbą całkowitą dodatnią większą od 2.</p>
