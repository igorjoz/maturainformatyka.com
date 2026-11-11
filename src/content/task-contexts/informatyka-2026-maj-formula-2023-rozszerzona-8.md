---
{
  "examId": "informatyka-2026-maj-formula-2023-rozszerzona",
  "number": "8",
  "title": "Sieć sklepów",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    18,
    19
  ]
}
---

<p>W trzech plikach tekstowych o nazwach klienci.txt, transakcje.txt, opis_transakcji.txt zapisano dane o sprzedaży towarów w pewnej sieci sklepów w porach wieczornych pierwszych dni miesiąca. Dane obejmują informacje od 1. do 3. dnia miesiąca w miesiącach od stycznia do czerwca 2025 roku w godzinach od 22:00 do 23:59. Pierwszy wiersz każdego z plików jest wierszem nagłówkowym, a dane w wierszach rozdzielono tabulatorami.</p>

<p>Plik klienci.txt zawiera informacje na temat zarejestrowanych klientów sieci sklepów. W każdym wierszu zapisano: IdKlienta – unikatowy identyfikator klienta (liczba całkowita) Imie − imię klienta (tekst do 20 znaków) Nazwisko – nazwisko klienta (tekst do 20 znaków) Plec − płeć klienta (znak K lub M).</p>

<p>Przykład:</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">IdKlienta</th><th scope="col">Imie</th><th scope="col">Nazwisko</th><th scope="col">Plec</th></tr></thead><tbody><tr><td>1</td><td>Zofia</td><td>Sawicka</td><td>K</td></tr><tr><td>2</td><td>Zuzanna</td><td>Chmiel</td><td>K</td></tr><tr><td>3</td><td>Hanna</td><td>Sokolowska</td><td>K</td></tr></tbody></table></div>

<p>Plik transakcje.txt zawiera informacje o dokonanych transakcjach. W każdym wierszu zapisano: IdTransakcji – unikatowy identyfikator transakcji (uwaga: identyfikatory nie są nadane chronologicznie – nie są kolejnymi numerami transakcji) DataTransakcji – datę transakcji (dd.mm.rrrr) IdKlienta – identyfikator klienta, który dokonał transakcji IdSklepu – identyfikator sklepu, w którym dokonano transakcji IdSprzedawcy – identyfikator sprzedawcy, który obsługiwał klienta przy kasie; jeśli klient korzystał z kasy samoobsługowej, pole jest puste (brak danych).</p>

<p>Przykład:</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">IdTransakcji</th><th scope="col">DataTransakcji</th><th scope="col">IdKlienta</th><th scope="col">IdSklepu</th><th scope="col">IdSprzedawcy</th></tr></thead><tbody><tr><td>1</td><td>01.01.2025</td><td>1814</td><td>12</td><td>160</td></tr><tr><td>2</td><td>01.02.2025</td><td>550</td><td>4</td><td>125</td></tr><tr><td>3</td><td>01.03.2025</td><td>1408</td><td>16</td><td>65</td></tr><tr><td>4</td><td>01.04.2025</td><td>1146</td><td>14</td><td>33</td></tr><tr><td>5</td><td>01.05.2025</td><td>630</td><td>9</td><td></td></tr><tr><td>6</td><td>01.06.2025</td><td>1011</td><td>12</td><td>120</td></tr></tbody></table></div>

<p>Plik o nazwie opis_transakcji.txt zawiera informacje o produktach zakupionych w danej transakcji. W każdym wierszu zapisano: IdTransakcji – identyfikator transakcji (uwaga: identyfikatory mogą się powtarzać) IdProduktu − identyfikator zakupionego produktu Cena – cena jednostkowa zakupionego produktu Liczba – liczba określająca, ile sztuk danego produktu zakupiono.</p>

<p>Przykład:</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><thead><tr><th scope="col">IdTransakcji</th><th scope="col">IdProduktu</th><th scope="col">Cena</th><th scope="col">Liczba</th></tr></thead><tbody><tr><td>485</td><td>78</td><td>5,66</td><td>11</td></tr><tr><td>104</td><td>87</td><td>7</td><td>4</td></tr><tr><td>104</td><td>84</td><td>2</td><td>5</td></tr><tr><td>246</td><td>42</td><td>7,0</td><td>15</td></tr></tbody></table></div>

<p>Z wykorzystaniem danych zawartych w podanych plikach oraz dostępnych narzędzi informatycznych podaj odpowiedzi do zadań 8.1.–8.4. Odpowiedzi zapisz w pliku wyniki8.txt, a każdą z nich poprzedź numerem odpowiedniego zadania.</p>

<p>Do oceny oddajesz:</p><ul><li>plik tekstowy wyniki8.txt – zawierający odpowiedzi do poszczególnych zadań (odpowiedź do każdego zadania powinna być poprzedzona jego numerem)</li><li>plik(i) zawierający(e) komputerową realizację Twoich obliczeń o nazwie(-ach) (uwaga: brak tych plików jest równoznaczny z brakiem rozwiązania zadania):</li></ul>
