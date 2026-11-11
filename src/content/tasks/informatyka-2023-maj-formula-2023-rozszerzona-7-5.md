---
{
  "parentId": "informatyka-2023-maj-formula-2023-rozszerzona-7",
  "number": "7.5",
  "title": "SQL: koszt promocyjnych gier logicznych",
  "summary": "Zapisz zapytanie obliczające łączny koszt wybranych pozycji sklepu.",
  "points": 2,
  "topics": [
    "relacje-i-laczenie-tabel",
    "filtrowanie",
    "grupowanie-i-agregacja"
  ],
  "difficulty": 2,
  "rationale": "SQL: koszt promocyjnych gier logicznych: wymaga połączenia kilku operacji i samodzielnego doboru sposobu obliczeń.",
  "sheetPages": [
    20
  ],
  "gradingPages": [
    21
  ],
  "dataFiles": [],
  "dependencies": []
}
---

<p>Do wcześniej opisanych tabel bazy danych dołączamy kolejną o nazwie sklep, w której zapisano cennik gier sprzedawanych w pewnym sklepie. Tabela zawiera następujące pola:</p>

<p>id_gry    – identyfikator gry cena – cena gry promocja  – informacja, czy cena jest ceną promocyjną (wartość true – jeśli cena jest</p>

<p>promocyjna albo false – kiedy nie jest promocyjna)</p>

<p>Tabele gry i sklep są połączone relacją jeden do wielu.</p>

<figure><img src="/pliki/zadania/informatyka-2023-maj-formula-2023-rozszerzona/relacja-gry-sklep.png" alt="Relacja jeden do wielu między tabelami gry i sklep przez pole id_gry." loading="lazy" /></figure>

<p>Uwaga: • gra może mieć dwie ceny (cena w promocji i cena bez promocji), tj. może występować w tabeli sklep dwa razy tabela sklep zawiera tylko identyfikatory gier, które są w ofercie sklepu (nie musi zawierać • wszystkich identyfikatorów z tabeli gry).</p>

<p>Zapisz zapytanie SQL, w wyniku którego uzyskamy informację, ile należałoby zapłacić za zakup w tym sklepie po jednej sztuce ze wszystkich gier logicznych (kategoria „logiczna”) dostępnych w cenach promocyjnych.</p>
