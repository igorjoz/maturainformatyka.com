---
{
  "parentId": "informatyka-2025-maj-formula-2023-rozszerzona-3",
  "number": "3.2",
  "title": "Punkty na trasie drona",
  "summary": "Odtwórz pozycje drona, sprawdź wnętrze kwadratu i wyszukaj trójkę ze środkiem odcinka.",
  "points": 4,
  "topics": [
    "tablice-i-ciagi",
    "pliki",
    "wyszukiwanie",
    "analiza-i-symulacja"
  ],
  "difficulty": 3,
  "rationale": "Łączy sumy przemieszczeń, warunki geometryczne i wyszukiwanie trójek punktów.",
  "sheetPages": [
    11
  ],
  "gradingPages": [
    8,
    9
  ],
  "dataFiles": [
    "dane maj 23/dron.txt",
    "dane maj 23/dron_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>Rozważmy wszystkie punkty, w których dron znajdował się po wykonaniu kolejnych ruchów (przesunięć).</p>

<p>Dla danych z przykładu 1. będą to punkty: (3000, 2000), (5000, 11000), (10000, 4000), (15000, 8000), (18000, 14000) i (20000, 0).</p>

<p>a) Podaj, ile spośród wszystkich rozważanych punktów znajduje się wewnątrz kwadratu o wierzchołkach (0, 0), (0, 5000), (5000, 5000), (5000, 0). Nie liczymy punktów leżących na krawędziach kwadratu.</p>

<p>b) Spośród wszystkich rozważanych punktów znajdź i podaj trzy różne, takie, że jeden z nich jest środkiem odcinka o końcach w pozostałych dwóch. Jest tylko jedna taka trójka punktów. Uwaga: punkty należące do szukanej trójki nie muszą być trzema kolejnymi punktami, do których przemieszczał się dron.</p>

<p>Odpowiedź dla pliku dron_przyklad.txt to a) 2 b) (14000, 3014), (16000, 2010), (18000, 1006)</p>

<div class="practice-slots"><div data-practice="wewnatrz">a) Liczba punktów wewnątrz kwadratu: …</div><div data-practice="x1">b) Punkt 1 — x: …</div><div data-practice="y1">b) Punkt 1 — y: …</div><div data-practice="x2">b) Punkt 2 — x: …</div><div data-practice="y2">b) Punkt 2 — y: …</div><div data-practice="x3">b) Punkt 3 — x: …</div><div data-practice="y3">b) Punkt 3 — y: …</div></div>
