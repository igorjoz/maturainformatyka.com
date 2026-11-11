---
{
  "examId": "informatyka-2023-maj-formula-2023-rozszerzona",
  "number": "1",
  "title": "Biblioteczka Adama",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    4,
    5
  ]
}
---

<p>Adam przechowuje swoje książki w biblioteczce zbudowanej z półek ponumerowanych kolejno 0, 1, 2, … (zaczynając od półki położonej najwyżej). Półka o numerze i ma 2<sup>i</sup> przegródek, w których umieszczane są książki. W jednej przegródce można umieścić tylko jedną książkę. Przegródki na i-tej półce są ponumerowane od lewej do prawej kolejnymi liczbami 1, 2, 3, …,  2<sup>i</sup>. Jako B[i, j] oznaczamy j-tą przegródkę na i-tej półce.</p>

<p>Przykład 1. Szara komórka to przegródka B[3, 4]</p>

<figure><img src="/pliki/zadania/informatyka-2023-maj-formula-2023-rozszerzona/biblioteczka-przyklad-1.png" alt="Biblioteczka: pięć półek; szara przegródka B[3,4]." loading="lazy" /></figure>

<p>Każda książka ma swój numer identyfikacyjny. Adam ustawia książki na półkach, zawsze zaczynając od przegródki B[0,1]. Stosuje przy tym następującą, rekurencyjną regułę: Adam sprawdza, czy przegródka B[i, j] (i ≥ 0 oraz 1 ≤ j ≤ 2<sup>i</sup>) jest pusta. Jeśli tak, umieszcza książkę w tej przegródce. W przeciwnym przypadku porównuje numer wstawianej książki z numerem książki w przegródce. Jeśli numer wstawianej książki jest mniejszy od numeru książki stojącej w przegródce, próbuje umieścić książkę na kolejnej półce w przegródce B[i + 1, 2j – 1]. Jeśli numer wstawianej książki jest większy od numeru książki w przegródce, to próbuje umieścić książkę w przegródce B[i + 1, 2j].</p>

<p>Przykład 2. Poniżej przedstawiono zawartość biblioteczki po wstawieniu do niej książek kolejno o numerach: 10, 2, 15, 13, 1, 5, 25 (zakładamy, że przedtem biblioteczka była pusta).</p>

<figure><img src="/pliki/zadania/informatyka-2023-maj-formula-2023-rozszerzona/biblioteczka-przyklad-2.png" alt="Biblioteczka po wstawieniu książek 10, 2, 15, 13, 1, 5, 25: półka 0: 10; półka 1: 2, 15; półka 2: 1, 5, 13, 25." loading="lazy" /></figure>

<p>Przykład 3. Poniżej przedstawiono zawartość biblioteczki po wstawieniu do niej książek kolejno o numerach: 1, 5, 10, 15, 2, 25, 13 (zakładamy, że przedtem biblioteczka była pusta).</p>

<figure><img src="/pliki/zadania/informatyka-2023-maj-formula-2023-rozszerzona/biblioteczka-przyklad-3.png" alt="Biblioteczka po wstawieniu książek 1, 5, 10, 15, 2, 25, 13: B[0,1]=1; B[1,2]=5; B[2,3]=2; B[2,4]=10; B[3,8]=15; B[4,15]=13; B[4,16]=25." loading="lazy" /></figure>
