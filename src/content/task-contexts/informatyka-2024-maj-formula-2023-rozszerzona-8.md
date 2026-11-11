---
{
  "examId": "informatyka-2024-maj-formula-2023-rozszerzona",
  "number": "8",
  "title": "Rejestr wykroczeń",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    15,
    16
  ]
}
---

<p>W trzech plikach tekstowych o nazwach: kierowcy.txt, taryfikator.txt, rejestr.txt, zapisano dane związane z przekroczeniem dozwolonych prędkości pojazdów na pewnej trasie w okresie 2023-01-01 – 2023-12-30 (wszystkie dane są fikcyjne i wygenerowane na potrzeby zadania). Pierwszy wiersz każdego z plików jest wierszem nagłówkowym, a dane w wierszach rozdzielono znakiem średnika.</p>

<p>Plik o nazwie kierowcy.txt zawiera informacje o 1000 osobach będących właścicielami samochodów. W każdym wierszu znajduje się: IdOsoby – identyfikator kierowcy Imie – imię Nazwisko – nazwisko NrRejestracyjny – numer rejestracyjny samochodu.</p>

<p>Przykład: IdOsoby;Imie;Nazwisko;NrRejestracyjny 1;Echo;Ayala;FVX4190 2;Nolan;Stein;DUG5882 3;Lee;Joseph;TBG6984</p>

<p>Plik o nazwie taryfikator.txt zawiera  informacje o 6 rodzajach wykroczeń związanych z przekroczeniem prędkości. W każdym wierszu znajdują się: IdWykroczenia   – identyfikator wykroczenia Wykroczenie – opis wykroczenia Punkty – liczba punktów karnych za dane wykroczenie Kwota – kwota mandatu, jaką należy zapłacić za to wykroczenie.</p>

<p>Przykład: IdWykroczenia;Wykroczenie;Punkty;Kwota 1;Przekroczenie predkosci do 10 km/h;0;50 2;Przekroczenie predkosci od 11 do 20 km/h;2;100 3;Przekroczenie predkosci od 21 do 30 km/h;4;200 4;Przekroczenie predkosci od 31 do 40 km/h;6;300 5;Przekroczenie predkosci od 41 do 50 km/h;8;400 6;Przekroczenie predkosci od 51 km/h;10;500</p>

<p>Plik o nazwie rejestr.txt zawiera 5000 zarejestrowanych wykroczeń związanych z przekroczeniem prędkości. W każdym wierszu znajdują się: IdZdarzenia – identyfikator zdarzenia Data – data zdarzenia w formacie rrrr-mm-dd IdOsoby – identyfikator kierowcy IdWykroczenia   – identyfikator wykroczenia.</p>

<p>Przykład: IdZdarzenia;Data;IdOsoby;IdWykroczenia 1;2023-01-01;617;1 2;2023-01-01;956;4</p>

<p>Z wykorzystaniem danych zawartych w podanych plikach oraz dostępnych narzędzi informatycznych podaj odpowiedzi do zadań 8.1.–8.3. Odpowiedzi zapisz w pliku wyniki8.txt, a każdą z nich poprzedź numerem odpowiedniego zadania.</p>

<p>Do oceny oddajesz: • plik tekstowy wyniki8.txt – zawierający odpowiedzi do poszczególnych zadań (odpowiedź do każdego zadania powinna być poprzedzona jego numerem) • plik(i) zawierający(-e) komputerową realizację Twoich obliczeń o nazwie(-ach) (uwaga: brak tych plików jest równoznaczny z brakiem rozwiązania zadania):</p>
