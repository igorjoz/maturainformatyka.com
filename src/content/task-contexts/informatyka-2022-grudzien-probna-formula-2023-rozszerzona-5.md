---
{
  "examId": "informatyka-2022-grudzien-probna-formula-2023-rozszerzona",
  "number": "5",
  "title": "Hotel „Panorama”",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    11,
    12,
    13
  ]
}
---

W plikach tekstowych: **klienci.txt**, **pokoje.txt**, **noclegi.txt** zapisano informacje dotyczące realizowanych usług hotelu „Panorama” w okresie od 1.07.2022 do 30.09.2022.
Pierwszy wiersz każdego z plików jest wierszem nagłówkowym, a dane w wierszach rozdzielono znakami tabulacji.

Plik **klienci.txt** w każdym wierszu zawiera: numer dowodu gościa hotelu (nr_dowodu), nazwisko (nazwisko), imię (imie) i miejsce zamieszkania gościa (miejscowosc).

Przykład:
<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th>nr_dowodu</th><th>nazwisko</th><th>imie</th><th>miejscowosc</th></tr></thead><tbody><tr><td>SAS253401</td><td>Pastuszak</td><td>Joanna</td><td>Szczecin</td></tr><tr><td>UNC608098</td><td>Siudut</td><td>Anna</td><td>Jaworzno</td></tr><tr><td>NMZ567271</td><td>Konopka</td><td>Kamil</td><td>Tarnowskie Gory</td></tr></tbody></table></div>

Plik **pokoje.txt** w każdym wierszu zawiera: numer pokoju (nr_pokoju), standard pokoju (standard, gdzie N oznacza normalny, a W – wysoki) oraz cenę wynajęcia pokoju na jedną dobę (cena).

Przykład:
<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th>nr_pokoju</th><th>standard</th><th>cena</th></tr></thead><tbody><tr><td>101</td><td>N</td><td>220</td></tr><tr><td>102</td><td>N</td><td>220</td></tr><tr><td>103</td><td>N</td><td>220</td></tr></tbody></table></div>

W pliku **noclegi.txt** zapisano w każdym wierszu: identyfikator pobytu gościa (id_pobytu), datę przyjazdu gościa hotelu (data_przyjazdu), datę wyjazdu gościa (data_wyjazdu), numer dowodu gościa wynajmującego pokój (nr_dowodu) i numer pokoju, który wynajmował (nr_pokoju).

Przykład:
<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th>id_pobytu</th><th>data_przyjazdu</th><th>data_wyjazdu</th><th>nr_dowodu</th><th>nr_pokoju</th></tr></thead><tbody><tr><td>198</td><td>2022-07-10</td><td>2022-07-12</td><td>JAA932190</td><td>501</td></tr><tr><td>199</td><td>2022-07-10</td><td>2022-07-11</td><td>SIS395155</td><td>108</td></tr><tr><td>206</td><td>2022-07-10</td><td>2022-07-13</td><td>RMS452742</td><td>113</td></tr></tbody></table></div>

Z wykorzystaniem danych zawartych w plikach i dostępnych narzędzi informatycznych, wykonaj zadania. Odpowiedzi zapisz w kolejnych wierszach pliku tekstowego **wyniki5.txt**. Odpowiedź do każdego zadania poprzedź numerem tego zadania.

**Informacja do zadań 5.4. i 5.5.**

Załóżmy, że do opisanych wcześniej tabel bazy danych: klienci, pokoje, noclegi dodano jeszcze jedną – **uslugi_dodatkowe**, w której zapisano usługi zamówione przez gości hotelu.

Tabela uslugi_dodatkowe składa się z pól:

- data_wykonania (data, kiedy usługa została wykonana),
- id_pobytu (identyfikator pobytu gościa, który zamówił usługę),
- rodzaj (rodzaj usługi: śniadanie, obiad, kolacja, basen, masaż, fryzjer),
- cena_uslugi (cena, którą gość zapłacił za usługę).
