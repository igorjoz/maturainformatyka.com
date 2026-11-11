---
{
  "parentId": "informatyka-2022-grudzien-probna-formula-2023-rozszerzona-3",
  "number": "3.1",
  "title": "Uzupełnianie sita Eratostenesa",
  "summary": "Uzupełnij pseudokod algorytmu wyznaczania liczb pierwszych.",
  "points": 3,
  "topics": [
    "algorytmy-liczbowe",
    "tablice-i-ciagi",
    "warunki-i-petle"
  ],
  "difficulty": 2,
  "rationale": "Wymaga zrozumienia zależnych warunków i aktualizacji indeksów w sicie Eratostenesa.",
  "sheetPages": [
    7
  ],
  "gradingPages": [
    7
  ],
  "dataFiles": [],
  "dependencies": []
}
---

Uzupełnij luki oznaczone poziomymi kreskami w poniższym algorytmie sita Eratostenesa – algorytmie wyznaczania wszystkich liczb pierwszych nie większych od zadanej liczby całkowitej N > 1.

**Specyfikacja**

Dane: N – liczba całkowita większa od 1.

Wynik: SITO[1..N] – tablica logiczna taka, że dla i = 1, 2, …, N, SITO[i] = PRAWDA, gdy i jest liczbą pierwszą, natomiast SITO[i] = FAŁSZ, gdy i jest liczbą złożoną.

**Algorytm**

<pre><code>SITO[1] ← FAŁSZ
dla i = 2, 3, …, N
    SITO[i] ← PRAWDA
dla i = 2, 3, …, _____
    jeżeli SITO[i] = _________
        j ← ________
        dopóki j ≤ N wykonuj
            SITO[j] ← _________
            j ← ________</code></pre>
