---
{
  "examId": "informatyka-2025-maj-formula-2023-rozszerzona",
  "number": "7",
  "title": "Poszukiwanie wody na Marsie",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    15,
    16
  ]
}
---

<p>W trzech plikach tekstowych o nazwach laziki.txt, obszary.txt, pomiary.txt zapisano informacje zawierające dane o poszukiwaniu wody na Marsie w latach 2050–2080. Łaziki zasilane energią słoneczną poruszają się po różnych obszarach Marsa i wykonują pomiary georadarowe, na podstawie których szacują ilość wody i głębokość, na której się ona znajduje. Pierwszy wiersz każdego z plików jest wierszem nagłówkowym, a dane w wierszach rozdzielono znakami tabulacji.</p>

<p>Plik o nazwie laziki.txt zawiera informacje o różnych łazikach, które wykonywały pomiary. W każdym wierszu tego pliku znajdują się: nr_lazika – co najwyżej trzycyfrowy, unikatowy numer łazika nazwa_lazika – nazwa łazika (tekst do 50 znaków) rok_wyslania – rok startu z Ziemi wsp_ladowania – współrzędne lądowania na Marsie oddzielone znakiem przecinka i spacją</p>

<p>Przykład:</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">nr_lazika</th><th scope="col">nazwa_lazika</th><th scope="col">rok_wyslania</th><th scope="col">wsp_ladowania</th></tr></thead><tbody><tr><td>1</td><td>Mariner 3</td><td>2049</td><td>50.51N, 70.01E</td></tr><tr><td>2</td><td>Mariner 6</td><td>2050</td><td>11.90N, 119.49E</td></tr><tr><td>3</td><td>Mariner 7</td><td>2050</td><td>44.90S, 130.80W</td></tr></tbody></table></div>

<p>Plik o nazwie obszary.txt zawiera informacje o obszarach na Marsie. W każdym wierszu tego pliku znajdują się: kod_obszaru – pięcioznakowy, unikatowy kod obszaru nazwa_obszaru – nazwa obszaru (tekst do 50 znaków)</p>

<p>Przykład:</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">kod_obszaru</th><th scope="col">nazwa_obszaru</th></tr></thead><tbody><tr><td>MC-01</td><td>Mare Boreum</td></tr><tr><td>MC-02</td><td>Diacria</td></tr><tr><td>MC-03</td><td>Arcadia</td></tr></tbody></table></div>

<p>Plik o nazwie pomiary.txt zawiera informacje o wynikach badań georadarowych wykonanych przez łaziki. W każdym wierszu tego pliku znajdują się: nr_lazika – co najwyżej trzycyfrowy numer łazika data_pomiaru – data wykonania pomiaru (w formacie rrrr-mm-dd) kod_obszaru – pięcioznakowy kod obszaru, na którym został wykonany pomiar wspolrzedne – współrzędne wykonania pomiaru, oddzielone znakiem przecinka i spacją glebokosc – szacowana głębokość, na której znajduje się woda (w metrach) ilosc – szacowana ilość wody (w m<sup>3</sup>)</p>

<p>Przykład:</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">nr_lazika</th><th scope="col">data_pomiaru</th><th scope="col">kod_obszaru</th><th scope="col">wspolrzedne</th><th scope="col">glebokosc</th><th scope="col">ilosc</th></tr></thead><tbody><tr><td>17</td><td>2061-06-03</td><td>MC-13</td><td>13.17N, 77.80E</td><td>344</td><td>5622</td></tr><tr><td>17</td><td>2056-06-02</td><td>MC-14</td><td>14.93N, 106.00E</td><td>43</td><td>2054</td></tr><tr><td>47</td><td>2075-10-18</td><td>MC-05</td><td>45.57N, 3.30E</td><td>9</td><td>23366</td></tr></tbody></table></div>

<p>Z wykorzystaniem danych zawartych w podanych plikach oraz dostępnych narzędzi informatycznych podaj odpowiedzi do zadań 7.1–7.4. Odpowiedzi zapisz w pliku wyniki7.txt, a każdą z nich poprzedź numerem odpowiedniego zadania.</p>

<p>Do oceny oddajesz:</p><ul><li>plik tekstowy wyniki7.txt – zawierający odpowiedzi do poszczególnych zadań (odpowiedź do każdego zadania powinna być poprzedzona jego numerem)</li><li>plik(i) zawierający(e) komputerową realizację Twoich obliczeń o nazwie(-ach) (uwaga: brak tych plików jest równoznaczny z brakiem rozwiązania zadania):</li></ul>
