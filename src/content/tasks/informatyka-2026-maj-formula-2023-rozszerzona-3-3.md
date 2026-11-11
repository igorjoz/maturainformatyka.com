---
{
  "parentId": "informatyka-2026-maj-formula-2023-rozszerzona-3",
  "number": "3.3",
  "title": "Najdłuższy prefiksosufiks",
  "summary": "Wyszukaj pary słów z odpowiednio długim wspólnym początkiem i końcem.",
  "points": 4,
  "topics": [
    "napisy",
    "pliki",
    "wyszukiwanie"
  ],
  "difficulty": 3,
  "rationale": "Wymaga sprawdzenia długości dopasowań w obu kierunkach i wyboru najdłuższego.",
  "sheetPages": [
    11
  ],
  "gradingPages": [
    8,
    9
  ],
  "dataFiles": [
    "Dane-NF-2605/pary.txt",
    "Dane-NF-2605/pary_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>Prefiksosufiksem pary słów s1, s2 nazywamy słowo, które jest początkiem s1 (czyli s1 zaczyna się tym słowem) oraz końcem s2 (czyli s2 kończy się tym słowem) lub początkiem s2 oraz końcem s1.</p>

<p>Podaj wszystkie pary słów z pliku pary.txt, dla których najdłuższy prefiksosufiks ma co najmniej 5 liter. Dla każdej podanej w odpowiedzi pary słów podaj długość najdłuższego prefiksosufiksu tej pary.</p>

<p>Przykłady: Dla pary aabbbca caacaab mamy następujące prefiksosufiksy:</p><ul><li>aab – początek pierwszego słowa i koniec drugiego</li><li>ca – początek drugiego słowa i koniec pierwszego. Najdłuższy prefiksosufiks ma długość 3, zatem para tych słów nie spełnia wymaganych warunków.</li></ul>

<p>Dla pary abbaabaa baabaabba mamy następujące prefiksosufiksy:</p><ul><li>a – początek pierwszego słowa i koniec drugiego</li><li>abba – początek pierwszego słowa i koniec drugiego</li><li>baa – początek drugiego słowa i koniec pierwszego</li><li>baabaa – początek drugiego słowa i koniec pierwszego. Najdłuższy prefiksosufiks ma długość 6, zatem para spełnia warunki wymagane w zadaniu.</li></ul>

<p>Dla pliku pary_przyklad.txt poprawną odpowiedzią jest ececdddeed dddeedd 6 (najdłuższy prefiksosufiks ma długość 6)</p>
