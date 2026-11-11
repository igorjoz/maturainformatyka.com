---
{
  "parentId": "informatyka-2024-grudzien-probna-formula-2023-rozszerzona-8",
  "number": "8.5",
  "title": "SQL: właściciele samochodów z Chorzowa",
  "summary": "Zapisz zapytanie z połączeniem tabel, warunkami wyboru i sortowaniem nazwisk.",
  "points": 2,
  "topics": [
    "relacje-i-laczenie-tabel",
    "filtrowanie",
    "sortowanie"
  ],
  "difficulty": 2,
  "rationale": "SQL: właściciele samochodów z Chorzowa: wymaga połączenia kilku operacji i samodzielnego doboru sposobu obliczeń.",
  "sheetPages": [
    15
  ],
  "gradingPages": [
    20
  ],
  "dataFiles": [],
  "dependencies": []
}
---

<p>Do wcześniej opisanej bazy danych dołączono kolejną tabelę o nazwie wlasciciele, w której zapisano informacje o właścicielach serwisowanych samochodów: id_wlasciciela, imie, nazwisko. Tabele wlasciciele i samochody są połączone relacją „jeden do wielu”:</p>

<figure><img src="/pliki/zadania/informatyka-2024-grudzien-probna-formula-2023-rozszerzona/relacja-wlasciciele-samochody.png" alt="Relacja jeden do wielu między tabelami wlasciciele i samochody przez pole id_wlasciciela." loading="lazy" /></figure>

<p>Uwaga: jedna osoba może być właścicielem kilku samochodów. Każdy samochód ma tylko jednego właściciela.</p>

<p>Zapisz zapytanie SQL, w wyniku którego uzyskasz imiona i nazwiska właścicieli samochodów zarejestrowanych w Chorzowie (nr rejestracyjny rozpoczyna się od liter SH) i wyprodukowanych w 2020 roku. Nazwiska uporządkuj alfabetycznie.</p>
