---
{
  "parentId": "informatyka-2024-maj-formula-2023-rozszerzona-8",
  "number": "8.4",
  "title": "SQL: fotoradary bez wykroczeń",
  "summary": "Zapisz zapytanie wybierające rekordy bez powiązanych zdarzeń.",
  "points": 2,
  "topics": [
    "relacje-i-laczenie-tabel",
    "filtrowanie"
  ],
  "difficulty": 2,
  "rationale": "SQL: fotoradary bez wykroczeń: wymaga połączenia kilku operacji i samodzielnego doboru sposobu obliczeń.",
  "sheetPages": [
    17
  ],
  "gradingPages": [
    20
  ],
  "dataFiles": [],
  "dependencies": []
}
---

<p>Baza danych rejestru wykroczeń została zmodyfikowana. Dodano nową tabelę Fotoradar, wraz z polami IdFotoradaru, Miejscowosc i DozwolonaPredkosc. Natomiast do tabeli Rejestr zostało dodane pole IdFotoradaru, w którym dla każdego rekordu zapisano identyfikator tego fotoradaru, który zarejestrował dane wykroczenie.</p>

<p>Załóżmy, że w bazie istnieją fotoradary, które nie zarejestrowały żadnych wykroczeń. Zapisz w języku SQL zapytanie, w wyniku którego otrzymasz identyfikatory tych fotoradarów.</p>
