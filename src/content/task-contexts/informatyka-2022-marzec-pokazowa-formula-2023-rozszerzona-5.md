---
{
  "examId": "informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona",
  "number": "5",
  "title": "Statki",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    13,
    14,
    15
  ]
}
---

W trzech plikach tekstowych o nazwach **statki.txt**, **kody.txt**, **przybycia.txt**, zapisano dane o statkach przybywających do portu w Szczecinie w okresie od 1.01.2016 do 31.12.2019. Pierwszy wiersz każdego z plików jest wierszem nagłówkowym, a dane w wierszach rozdzielono średnikami.

Plik o nazwie **statki.txt** zawiera informacje o 2 192 różnych statkach, które cumowały w szczecińskim porcie:

- Nr_IMO – siedmiocyfrowy, unikatowy identyfikator statku
- Nazwa_statku − nazwa statku (tekst do 50 znaków)
- Ladownosc − ładowność statku (maksymalnie 5-cyfrowa liczba).

Przykład:

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th>Nr_IMO</th><th>Nazwa_statku</th><th>Ladownosc</th></tr></thead><tbody><tr><td>5111696</td><td>RONJA</td><td>127</td></tr><tr><td>5255777</td><td>NORDSTJERNEN</td><td>2191</td></tr><tr><td>5273389</td><td>FRANEK</td><td>157</td></tr><tr><td>5312628</td><td>SANTA MARIA MANUELA</td><td>607</td></tr></tbody></table></div>

Plik o nazwie **przybycia.txt** zawiera zestawienie kolejnych statków przypływających do portu (10 034 wierszy) we wspomnianym okresie. W każdym wierszu znajduje się:

- LP − liczba porządkowa (liczba maksymalnie 5-cyfrowa)
- Data_przybycia − data przybycia (w formacie dd.mm.rrrr)
- Nr_IMO − siedmiocyfrowy identyfikator statku
- Bandera − symbol przynależności państwowej statku (tekst dwuznakowy)
- Nabrzeze − miejsce postoju statku (tekst do 20 znaków).

Uwaga: bandera odnotowywana jest w pliku **przybycia.txt**, ponieważ statek może zmienić banderę, np. jeżeli zakupi go inny armator.

Przykład:

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th>LP</th><th>Data_przybycia</th><th>Nr_IMO</th><th>Bandera</th><th>Nabrzeze</th></tr></thead><tbody><tr><td>1</td><td>01.01.2016</td><td>8415653</td><td>NO</td><td>HUTA (KRA)</td></tr><tr><td>2</td><td>01.01.2016</td><td>9201803</td><td>NL</td><td>CZESKIE</td></tr><tr><td>3</td><td>01.01.2016</td><td>8873764</td><td>RU</td><td>GLIWICKIE</td></tr><tr><td>4</td><td>01.01.2016</td><td>9374727</td><td>CY</td><td>HUK</td></tr></tbody></table></div>

Plik o nazwie **kody.txt** zawiera przyporządkowanie dwuliterowego kodu bandery do państwa. W każdym z 240 wierszy znajdują się:

- Bandera − tekst dwuznakowy
- Nazwa_kraju − nazwa kraju (tekst do 50 znaków)
- Kontynent − kontynent (tekst do 20 znaków).

Przykład:

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th>Bandera</th><th>Nazwa_kraju</th><th>Kontynent</th></tr></thead><tbody><tr><td>AF</td><td>AFGANISTAN</td><td>AZJA</td></tr><tr><td>AL</td><td>ALBANIA</td><td>EUROPA</td></tr><tr><td>DZ</td><td>ALGIERIA</td><td>AFRYKA</td></tr><tr><td>AD</td><td>ANDORA</td><td>EUROPA</td></tr></tbody></table></div>

Z wykorzystaniem danych zawartych w podanych plikach oraz dostępnych narzędzi informatycznych wykonaj poniższe polecenia. Każdą odpowiedź umieść w pliku **wyniki5.txt** i poprzedź oznaczeniem odpowiedniego zadania: od 5.1. do 5.3.

**Informacja do zadań 5.4. i 5.5.**

Do wcześniej opisanych tabel dołączamy kolejną o nazwie **Armator**, w której zapisano informacje o armatorach eksploatujących statki. Tabela Armator zawiera następujące pola:

- Id_armatora – unikatowy numer armatora,
- Armator – nazwa armatora,
- Siedziba_armatora – miasto, w którym armator ma swoją siedzibę,
- Typ_dzialalnosci – dominujący typ działalności, np. przewóz ładunków, eksploatacja morska, transport pasażerów itp.

Ponadto, do tabeli **Przybycia** dodano pole **Id_armatora**.
