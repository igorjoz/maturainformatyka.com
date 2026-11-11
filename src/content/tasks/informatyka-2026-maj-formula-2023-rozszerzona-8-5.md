---
{
  "parentId": "informatyka-2026-maj-formula-2023-rozszerzona-8",
  "number": "8.5",
  "title": "Wyszukiwanie produktów — SQL",
  "summary": "Zapisz zapytanie wybierające zakupione produkty z danej kategorii i z fragmentem opisu.",
  "points": 2,
  "topics": [
    "relacje-i-laczenie-tabel",
    "filtrowanie"
  ],
  "difficulty": 2,
  "rationale": "Łączy kilka tabel, dopasowanie fragmentu tekstu i wybór produktów faktycznie zakupionych.",
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

<p>Do bazy danych utworzonej na podstawie opisanych wcześniej plików dodano dwie kolejne tabele: o nazwie Produkty i o nazwie Kategorie, w których zapisano informacje o sprzedawanych produktach.</p>

<p>Tabela Kategorie zawiera następujące pola: IdKategorii – unikatowy identyfikator kategorii produktu NazwaKategorii – nazwa kategorii produktu.</p>

<p>Tabela Produkty zawiera następujące pola: IdProduktu – unikatowy identyfikator produktu IdKategorii – identyfikator kategorii, do której należy dany produkt Nazwa – nazwa produktu Opis – opis produktu.</p>

<p>Napisz w języku SQL zapytanie, w wyniku którego zostaną wypisane wszystkie zakupione produkty (IdProduktu i Nazwa) z kategorii (NazwaKategorii) „spozywcze” zawierające w opisie fragment: „do ekspresu kolbowego”.</p>
