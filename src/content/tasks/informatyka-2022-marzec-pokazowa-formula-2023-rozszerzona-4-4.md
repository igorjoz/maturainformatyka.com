---
{
  "parentId": "informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona-4",
  "number": "4.4",
  "title": "Symulacja wyjazdów pługów",
  "summary": "Zasymuluj narastanie opadu śniegu i godzinne odśnieżanie.",
  "points": 3,
  "topics": [
    "analiza-i-symulacja",
    "formuly",
    "daty"
  ],
  "difficulty": 3,
  "rationale": "Wieloetapowa symulacja musi rozróżniać deszcz, śnieg, przekroczenie progu i godzinę odśnieżania.",
  "sheetPages": [
    12
  ],
  "gradingPages": [
    14
  ],
  "dataFiles": [
    "Dane_2203/brenna.txt"
  ],
  "dependencies": [],
  "editorialNote": "W oryginalnym arkuszu przy zadaniu 4.4 podano 3 pkt; w zasadach oceniania nagłówek i kryteria wskazują 2 pkt. W katalogu zachowujemy punktację polecenia (3 pkt). Wprowadzenie do zadania 4 wymienia zakres 4.1–4.5, choć arkusz zawiera tylko podpunkty 4.1–4.4."
}
---

Zakładamy, że jeżeli temperatura jest mniejsza lub równa zero i jest opad (czyli opad > 0), to oznacza, że pada śnieg.

Opady śniegu są monitorowane przez przedsiębiorstwo odśnieżania. Zliczana jest łączna wysokość opadów śniegu z kolejnych godzin, w których nie padał deszcz. Jeżeli łączna wysokość opadów śniegu nieprzerwanych deszczem przekroczy 4 cm, to w następnej godzinie na drogi wyjeżdżają pługi odśnieżające.

Przykład:

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th>Data i godzina</th><th>Temperatura</th><th>Opad</th></tr></thead><tbody><tr><td>01.01.2019 09:00</td><td>-2,5</td><td>0</td></tr><tr><td>01.01.2019 10:00</td><td>-2,2</td><td>0,1</td></tr><tr><td>01.01.2019 11:00</td><td>-1,8</td><td>0</td></tr><tr><td>01.01.2019 12:00</td><td>-1,2</td><td>0,2</td></tr><tr><td>01.01.2019 13:00</td><td>-1,1</td><td>0,2</td></tr><tr><td>01.01.2019 14:00</td><td>-0,7</td><td>0,6</td></tr><tr><td>01.01.2019 15:00</td><td>-0,5</td><td>0,6</td></tr><tr><td>01.01.2019 16:00</td><td>-0,2</td><td>0,8</td></tr><tr><td>01.01.2019 17:00</td><td>0,2</td><td>2,5</td></tr></tbody></table></div>

Dla podanych danych od godziny 9:00 do 16:00 łączna wysokość opadów śniegu to 2,5 cm, o godzinie 17:00 spadł deszcz. W tym przypadku pługi nie wyjechały, a zliczanie opadów śniegu w kolejnych godzinach zacznie się od 0.

Odśnieżanie trwa dokładnie 1 godzinę (opad śniegu, który nastąpił w czasie pracy pługów, zostaje usunięty z dróg w tym cyklu odśnieżania). Opad z kolejnej godziny po odśnieżaniu staje się częścią sumy opadów dla następnego cyklu odśnieżania.

a) Podaj, ile razy pługi odśnieżające wyjeżdżały na drogi Brennej.

b) Podaj dzień, w którym pługi wyjeżdżały najwięcej razy oraz liczbę tych wyjazdów.

Do oceny oddajesz:

- plik **wyniki4.txt** zawierający odpowiedzi do zadań 4.1.−4.4.
- plik zawierający wykres do zadania 4.2.
- plik(-i) z komputerową realizacją zadania (kodem programu).

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="wyjazdy">a) Liczba wszystkich wyjazdów pługów: …</div>
<div data-practice="dzien">b) Dzień największej liczby wyjazdów (dd.mm.rrrr): …</div>
<div data-practice="maksimum">b) Największa liczba wyjazdów w jednym dniu: …</div>
</div>
