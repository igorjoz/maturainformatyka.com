---
{
  "parentId": "informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona-3",
  "number": "3.2",
  "title": "Szybkie potęgowanie modularne",
  "summary": "Zaprojektuj algorytm potęgowania modularnego o złożoności logarytmicznej.",
  "points": 4,
  "topics": [
    "algorytmy-liczbowe",
    "zlozonosc",
    "warunki-i-petle"
  ],
  "difficulty": 3,
  "rationale": "Wymaga zaprojektowania szybkiego potęgowania i dotrzymania złożoności O(log x).",
  "sheetPages": [
    8,
    9
  ],
  "gradingPages": [
    7,
    8
  ],
  "dataFiles": [],
  "dependencies": []
}
---

Zapisz w wybranej przez siebie notacji (w postaci pseudokodu lub w wybranym języku programowania) algorytm, który gdy są dane liczby a, x i M, obliczy b = a<sup>x</sup> mod M. Aby otrzymać maksymalną liczbę punktów, Twój algorytm powinien wykonywać O(log x) operacji arytmetycznych wymienionych w poniższej uwadze.

Uwaga: W zapisie algorytmu możesz wykorzystać tylko operacje arytmetyczne: dodawanie, odejmowanie, mnożenie, dzielenie, dzielenie całkowite, resztę z dzielenia, oraz porównywanie liczb; instrukcje sterujące i przypisania do zmiennych lub samodzielnie napisane funkcje zawierające wyżej wymienione operacje.

**Specyfikacja:**

Dane:

- a − liczba całkowita dodatnia
- x − nieujemna liczba całkowita
- M − liczba całkowita dodatnia

Wynik:

- b − nieujemna liczba całkowita o wartości równej a<sup>x</sup> mod M.
