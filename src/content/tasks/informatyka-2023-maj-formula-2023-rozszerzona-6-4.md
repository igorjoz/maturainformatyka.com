---
{
  "parentId": "informatyka-2023-maj-formula-2023-rozszerzona-6",
  "number": "6.4",
  "title": "Łączna masa wyprodukowanych konfitur",
  "summary": "Wyznacz wielkość produkcji z uwzględnieniem zapasów owoców między dniami.",
  "points": 3,
  "topics": [
    "formuly",
    "analiza-danych",
    "analiza-i-symulacja"
  ],
  "difficulty": 3,
  "rationale": "Łączna masa wyprodukowanych konfitur: wymaga złożonej analizy zależności, konstrukcji rozwiązania lub kontroli wielu warunków.",
  "sheetPages": [
    17
  ],
  "gradingPages": [
    17
  ],
  "dataFiles": [
    "Dane_2305/owoce.txt"
  ],
  "dependencies": []
}
---

<p>Informacja do zadań 6.3. i 6.4.</p>

<p>Przetwórnia produkuje konfitury: malinowo-truskawkowe, malinowo-porzeczkowe oraz truskawkowo-porzeczkowe (zawsze w proporcji owoców 1:1 oraz z wykorzystaniem maksymalnej dostępnej ilości owoców). Decyzja, jaka konfitura w danym dniu będzie produkowana, zależy od ilości owoców w przetwórni. Owoce są dostarczane do przetwórni rano, przed rozpoczęciem produkcji. W danym dniu jest produkowany tylko jeden rodzaj konfitur. Do produkcji są brane owoce, których jest najwięcej w przetwórni (dla danych w pliku owoce.txt nie występuje przypadek, gdy ilość różnych owoców jest taka sama). Owoce niewykorzystane do produkcji są przechowywane w chłodni do następnego dnia. W następnym dniu podejmuje się decyzję o produkcji na ten dzień na podstawie łącznej ilości owoców pozostałych z poprzedniego dnia oraz dostarczonych rano.</p>

<p>Przykład: Jeżeli 01.05.2020 dostarczono 211 kg malin, 281 kg truskawek i 88 kg porzeczek, to w tym dniu będzie produkowana konfitura malinowo-truskawkowa. Do produkcji wykorzystane zostanie 211 kg malin i 211 kg truskawek. Reszta truskawek i wszystkie porzeczki będą przechowywane w chłodni do następnego dnia. Po dostawie z 02.05.2020 (393 kg malin, 313 kg truskawek i 83 kg porzeczek) w przetwórni będzie 393 kg malin, 383 kg truskawek i 171 kg porzeczek, czyli znowu będzie produkowana konfitura malinowo-truskawkowa.</p>

<p>Po uwzględnieniu opisanego powyżej cyklu produkcyjnego oraz danych zapisanych w pliku owoce.txt podaj odpowiedzi do poniższych zadań.</p>

<p>Na wyprodukowanie 1 kg konfitur dwuowocowych potrzeba po 1 kg każdego owocu. Podaj, ile kilogramów konfitur każdego rodzaju wyprodukowano w okresie od 01.05.2020 do 30.09.2020.</p>

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="wynik-1">Konfitura malinowo-porzeczkowa (kg): …</div>
<div data-practice="wynik-2">Konfitura malinowo-truskawkowa (kg): …</div>
<div data-practice="wynik-3">Konfitura truskawkowo-porzeczkowa (kg): …</div>
</div>
