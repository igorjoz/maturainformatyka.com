---
{
  "examId": "informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona",
  "number": "2",
  "title": "Gra",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    5
  ]
}
---

W tym zadaniu analizujemy prostą grę polegającą na ustawianiu pionków na jednowymiarowej planszy B składającej się z s+1 pól, ponumerowanych 0, 1, …, s, dla pewnej dodatniej liczby całkowitej s. B[i] oznacza i-te pole na planszy.

Na początku gry na planszy stawiamy tylko 1 pionek na polu o numerze 0. Gra składa się z n tur. Sposób stawiania pionków w turach jest zadany przez n dodatnich liczb całkowitych zapisanych w tablicy A[1..n]. W k-tej turze pionki stawiamy zgodnie z procedurą Tura(k) zdefiniowaną następująco:

<pre><code>Tura(k)
    dla i = s, s – 1, ..., A[k] wykonuj
        jeśli na polu B[i - A[k]] znajduje się pionek i pole B[i] jest puste
            postaw pionek na polu B[i]</code></pre>

Formalnie rozgrywkę na planszy można zdefiniować teraz następująco:

**Dane:**

- s, n − dodatnie liczby całkowite
- A[1..n] − tablica n dodatnich liczb całkowitych

**Wynik:** B[0..s] – plansza do gry z ustawionymi pionkami, B[i] – i-te pole planszy

**Rozgrywka:**

<pre><code>postaw pionek na B[0];
dla k = 1, 2, …, n wykonuj
    Tura(k)</code></pre>

Gra kończy się sukcesem, gdy na polu B[s] stoi pionek.
