---
{
  "examId": "informatyka-2022-grudzien-probna-formula-2023-rozszerzona",
  "number": "2",
  "title": "Strzałki",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    5
  ]
}
---

Dla danej, dodatniej liczby całkowitej N, na kartce papieru rysujemy N różnych punktów i numerujemy je liczbami 1, 2, ..., N. W tym zadaniu będziemy łączyć punkty ze sobą strzałkami – funkcja strzałka(x,y) rysuje strzałkę od punktu o numerze x do punktu o numerze y.

Wywołanie poniżej zapisanej funkcji rekurencyjnej rysuj(x) poskutkuje narysowaniem pewnej liczby strzałek. Jej jedynym argumentem jest pewna liczba całkowita x z przedziału [1, N]. Przeanalizuj funkcję i znajdź odpowiedzi dla podanych zadań.

<pre><code>funkcja rysuj(x)
    jeżeli 2*x ≤ N
        strzałka(x, 2*x)
        rysuj(2*x)
    jeżeli 2*x + 1 ≤ N
        strzałka(x, 2*x + 1)
        rysuj(2*x + 1)</code></pre>

**Przykład:** Oto przykładowy rysunek otrzymany w wyniku wywołania rysuj(1) dla N = 5 i danego układu punktów:

![Przykładowy układ pięciu punktów i strzałek funkcji rysuj(1).](/pliki/zadania/informatyka-2022-grudzien-probna-formula-2023-rozszerzona/strzalki-przyklad.png)
