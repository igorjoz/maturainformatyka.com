---
{
  "parentId": "informatyka-2023-maj-formula-2023-rozszerzona-1",
  "number": "1.3",
  "title": "Rekurencyjne wypisywanie numerów książek",
  "summary": "Podaj kolejność odwiedzania przegródek przez algorytm rekurencyjny.",
  "points": 2,
  "topics": [
    "rekurencja",
    "analiza-i-symulacja"
  ],
  "difficulty": 2,
  "rationale": "Rekurencyjne wypisywanie numerów książek: wymaga połączenia kilku operacji i samodzielnego doboru sposobu obliczeń.",
  "sheetPages": [
    7
  ],
  "gradingPages": [
    4
  ],
  "dataFiles": [],
  "dependencies": []
}
---

<p>Kolega Adama, oglądający biblioteczkę, stwierdził, że aby wypisać wszystkie numery książek umieszczonych na półkach, można posłużyć się podanym poniżej rekurencyjnym algorytmem A, którego działanie rozpoczynamy od półki o numerze 0 i od przegródki o numerze 1. Zakładamy przy tym, że w biblioteczce jest co najmniej jedna książka.</p>

<pre><code>A(i, j)
    wypisz numer książki z przegródki B[i, j]
    jeżeli przegródka B[i + 1, 2j – 1] nie jest pusta, to
        wykonaj A(i + 1, 2j – 1)
    jeżeli przegródka B[i + 1, 2j] nie jest pusta, to
        wykonaj A(i + 1, 2j)</code></pre>

<p>Dla biblioteczki z siedmioma książkami z przykładu 2. algorytm A wypisze: 10, 2, 1, 5, 15, 13, 25.</p>

<p>Podaj ciągi liczb wypisane przez algorytm A dla podanych zawartości biblioteczki.</p>

<p>a)</p>

<figure><img src="/pliki/zadania/informatyka-2023-maj-formula-2023-rozszerzona/biblioteczka-a.png" alt="Przypadek a: B[0,1]=9; B[1,1]=2; B[1,2]=12; B[2,3]=10; B[2,4]=14; B[3,7]=13; B[3,8]=15." loading="lazy" /></figure>

<p>Odpowiedź: <span data-practice="a-1">…</span>, <span data-practice="a-2">…</span>, <span data-practice="a-3">…</span>, <span data-practice="a-4">…</span>, <span data-practice="a-5">…</span>, <span data-practice="a-6">…</span>, <span data-practice="a-7">…</span></p>

<p>b)</p>

<figure><img src="/pliki/zadania/informatyka-2023-maj-formula-2023-rozszerzona/biblioteczka-b.png" alt="Przypadek b: B[0,1]=10; B[1,1]=8; B[1,2]=15; B[2,1]=4; B[2,3]=12; B[3,2]=6; B[3,6]=13." loading="lazy" /></figure>

<p>Odpowiedź: <span data-practice="b-1">…</span>, <span data-practice="b-2">…</span>, <span data-practice="b-3">…</span>, <span data-practice="b-4">…</span>, <span data-practice="b-5">…</span>, <span data-practice="b-6">…</span>, <span data-practice="b-7">…</span></p>
