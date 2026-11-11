---
{
  "examId": "informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona",
  "number": "3",
  "title": "Potęgowanie modulo",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    7,
    10
  ]
}
---

Rozważmy operację potęgowania modularnego stosowaną np. w algorytmie RSA.

Liczbę a podnosimy do potęgi x, po czym bierzemy resztę z dzielenia otrzymanej liczby przez ustaloną liczbę M, dzięki czemu otrzymujemy wynik

**b = a<sup>x</sup> mod M,**

gdzie a, M – dodatnie liczby całkowite, x – nieujemna liczba całkowita.

Mówimy wtedy, że a<sup>x</sup> modulo M równa się b.

Przykład:

Dla a = 2, x = 5, M = 7 liczymy resztę z dzielenia 2<sup>5</sup> (czyli 32) przez 7, zatem b = 4.
Dla a = 3, x = 3 i M = 11 mamy b = 3<sup>3</sup> mod 11 = 5,
natomiast dla a = 10, x = 2 i M = 13 wynikiem jest b = 10<sup>2</sup> mod 13 = 9.

**Informacja do zadań 3.3.−3.5.**

W pliku **liczby.txt** jest 1 000 wierszy, w każdym − po trzy nieujemne liczby całkowite, kolejno M, a, b, oddzielone pojedynczymi spacjami. Liczby w pliku są nie większe niż 10 000, a ponadto wszystkie liczby M i a są większe bądź równe 2.

Napisz program(-y), który(-e) znajdzie(-dą) odpowiedzi do poniższych zadań. Każdą odpowiedź zapisz w pliku **wyniki3.txt** i poprzedź ją numerem odpowiedniego zadania.
Do Twojej dyspozycji jest plik **liczby_przyklad.txt**, w którym zapisano 5 wierszy w formacie opisanym wyżej. Odpowiedzi dla pliku przykładowego są podane przy odpowiednich zadaniach − możesz ich użyć, aby sprawdzić poprawność działania swojego programu.
