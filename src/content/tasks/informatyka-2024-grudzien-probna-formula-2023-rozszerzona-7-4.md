---
{
  "parentId": "informatyka-2024-grudzien-probna-formula-2023-rozszerzona-7",
  "number": "7.4",
  "title": "Minimalny początkowy zapas energii",
  "summary": "Przeprowadź bilans produkcji i zużycia z uwzględnieniem pojemności magazynu.",
  "points": 3,
  "topics": [
    "formuly",
    "analiza-danych",
    "analiza-i-symulacja"
  ],
  "difficulty": 3,
  "rationale": "Minimalny początkowy zapas energii: wymaga złożonej analizy zależności, konstrukcji rozwiązania lub kontroli wielu warunków.",
  "sheetPages": [
    12
  ],
  "gradingPages": [
    16
  ],
  "dataFiles": [
    "Dane-2412/energia.txt",
    "Dane-2412/zapotrzebowanie.txt"
  ],
  "dependencies": []
}
---

<p>Zaprojektowano magazyny energii o łącznej pojemności 200 000 MWh. W magazynach jest przechowywana energia wygenerowana, ale niewykorzystana. Jeśli bieżące generowanie energii nie zaspokaja bieżącego zapotrzebowania, energia jest pobierana z magazynów. Rozliczenia odbywają się w jednostkach godzinowych. Na potrzeby zadania wygenerowano dane – zapotrzebowanie na energię – i zapisano w pliku zapotrzebowanie.txt. Czasami jest ono mniejsze niż łączne generowanie energii, a czasami – większe. Zakładamy, że przesyłanie i przechowywanie energii nie przynosi strat energii.</p>

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><tbody><tr><th>Fragment pliku:</th><th></th><th></th></tr><tr><td>Data</td><td>Godzina</td><td>Zapotrzebowanie</td></tr><tr><td>2024-04-01</td><td>1</td><td>1524,564</td></tr><tr><td>2024-04-01</td><td>2</td><td>1307,093</td></tr><tr><td>2024-04-01</td><td>3</td><td>1222,506</td></tr><tr><td>2024-04-01</td><td>4</td><td>1225,012</td></tr><tr><td>2024-04-01</td><td>5</td><td>1836,463</td></tr></tbody></table></div>

<p>Podaj, ile najmniej energii powinno być zmagazynowane w dniu 1 kwietnia o godzinie 00:00 (na początku dnia), aby kwietniowe zapotrzebowanie było zaspokojone, tzn. ani razu nie zabrakło energii. W obliczeniach weź pod uwagę generowanie energii ze źródeł odnawialnych i energię możliwą do pobrania z magazynów. Wynik podaj z dokładnością do 1 MWh.</p>

<div class="practice-slots"><div data-practice="energia">Minimalna początkowa energia (MWh): …</div></div>
