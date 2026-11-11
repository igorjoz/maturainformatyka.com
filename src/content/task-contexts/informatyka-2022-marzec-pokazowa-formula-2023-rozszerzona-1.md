---
{
  "examId": "informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona",
  "number": "1",
  "title": "Szachy",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    2,
    3
  ]
}
---

Uwaga: do rozwiązania zadań 1.1.–1.3. nie jest potrzebna znajomość reguł gry w szachy.

W pliku **szachy.txt** znajduje się zapis partii szachów, jaką w 2020 roku rozegrali polski arcymistrz Jan Krzysztof Duda oraz mistrz świata Magnus Carlssen. Zapis partii składa się z opisów 125 plansz przedstawiających stany gry (położenie bierek na szachownicy) po kolejnych posunięciach każdego z graczy. Opis każdej planszy składa się z:

- 8 wierszy tekstu po 8 znaków w każdym wierszu
- kolejne znaki w wierszach oznaczają:
  - znak '.' − puste pole
  - wielkie litery − białe bierki (czyli białe figury i pionki)
  - małe litery − czarne bierki
  - oznaczenia bierek to: K/k − król, H/h − hetman, W/w − wieża, G/g − goniec, S/s − skoczek, P/p − pionek.

Dla zachowania czytelności, po każdym opisie następuje pojedynczy pusty wiersz. W dalszej części, zamiast „opis planszy”, będziemy pisać krótko „plansza”.

Przykład:

<pre>wsghkgsw
pppppppp
........
........
....P...
........
PPPP.PPP
WSGHKGSW

wsghkgsw
pp.ppppp
..p.....
........
....P...
........
PPPP.PPP
WSGHKGSW</pre>

Dwie podane wyżej przykładowe plansze odpowiadają następującym stanom gry:

![Dwie szachownice ilustrujące przykładowe opisy plansz: po ruchu białego pionka i po odpowiedzi czarnego pionka.](/pliki/zadania/informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona/szachownice-przyklad.png)

Napisz program(-y), który(-e) znajdzie(-dą) odpowiedzi do poniższych zadań.
Do Twojej dyspozycji jest plik **szachy_przyklad.txt**, który zawiera 9 plansz zapisanych w podanym wyżej formacie. Odpowiedzi dla pliku **szachy_przyklad.txt** podano w treści poszczególnych zadań. Pamiętaj, że Twój(-e) program(-y) musi(-szą) działać dla 125 plansz.
