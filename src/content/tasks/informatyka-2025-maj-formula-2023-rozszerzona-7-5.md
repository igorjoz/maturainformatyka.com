---
{
  "parentId": "informatyka-2025-maj-formula-2023-rozszerzona-7",
  "number": "7.5",
  "title": "Producenci łazików — zapytanie SQL",
  "summary": "Zapisz zapytanie zwracające unikatowych producentów łazików badających Arcadię w 2060 roku.",
  "points": 2,
  "topics": [
    "relacje-i-laczenie-tabel",
    "filtrowanie"
  ],
  "difficulty": 2,
  "rationale": "Wymaga połączenia kilku tabel, filtrów i usunięcia duplikatów.",
  "sheetPages": [
    17
  ],
  "gradingPages": [
    19
  ],
  "dataFiles": [],
  "dependencies": []
}
---

<p>Do tabel utworzonych na podstawie opisanych wcześniej plików dołączamy kolejną – o nazwie Producent, w której zapisano informacje o producentach poszczególnych modeli łazików.</p>

<p>Tabela Producent zawiera następujące pola: kod_producenta – unikatowy kod producenta nazwa – nazwa producenta kraj – kraj producenta</p>

<p>Do tabeli Laziki dodano pole kod_producenta.</p>

<p>Napisz w języku SQL zapytanie, w wyniku którego otrzymasz listę nazw producentów, których łaziki badały obszar Marsa o nazwie Arcadia w roku 2060. Nazwy producentów nie mogą się powtarzać.</p>
