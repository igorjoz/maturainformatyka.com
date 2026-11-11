---
{
  "parentId": "informatyka-2022-grudzien-probna-formula-2023-rozszerzona-1",
  "number": "1.3",
  "title": "Dobre passy w meczu",
  "summary": "Zlicz maksymalne serie zwycięstw i znajdź najdłuższą dobrą passę.",
  "points": 3,
  "topics": [
    "napisy",
    "tablice-i-ciagi",
    "warunki-i-petle",
    "pliki"
  ],
  "difficulty": 2,
  "rationale": "Wymaga poprawnego wyznaczenia granic serii, zliczania pass i śledzenia maksimum.",
  "sheetPages": [
    4,
    5
  ],
  "gradingPages": [
    3,
    4
  ],
  "dataFiles": [
    "Dane_2212/mecz.txt",
    "Dane_2212/mecz_przyklad.txt"
  ],
  "dependencies": []
}
---

Powiemy, że drużyna ma dobrą passę, jeśli wygrywa rozgrywki co najmniej 10 razy z rzędu. Każda dobra passa rozpoczyna się albo na początku meczu, albo bezpośrednio po przegranej rozgrywce. Każda dobra passa kończy się albo z końcem meczu, albo bezpośrednio przed przegraną rozgrywką.

Podaj łączną liczbę dobrych pass, które miały obie drużyny w meczu. Wyznacz długość najdłuższej dobrej passy i drużynę, która ją osiągnęła. Tylko jedna drużyna miała dobrą passę o tej długości.

Przykład: w meczu **BBBBBBBBBBAABBAAAAAAAAAAABA** mamy łącznie 2 dobre passy. Najdłuższą dobrą passę, o długości 11, osiągnęła drużyna A.

Dla pliku **mecz_przyklad.txt** odpowiedzią jest: **2 A 1000** (dwie dobre passy, najdłuższa drużyny A o długości 1000).

Do oceny oddajesz plik **wyniki1.txt**, zawierający odpowiedzi do zadań 1.1.–1.3., oraz plik(-i) zawierający(-e) kody źródłowe Twojego(-ich) programu(-ów). Brak tych plików jest równoznaczny z brakiem rozwiązania zadania.

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="passy">Liczba dobrych pass: …</div>
<div data-practice="druzyna">Drużyna z najdłuższą passą: …</div>
<div data-practice="dlugosc">Długość najdłuższej passy: …</div>
</div>
