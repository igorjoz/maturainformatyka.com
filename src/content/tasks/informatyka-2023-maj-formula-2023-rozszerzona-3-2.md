---
{
  "parentId": "informatyka-2023-maj-formula-2023-rozszerzona-3",
  "number": "3.2",
  "title": "Najrzadsze i najczęstsze pary cyfr",
  "summary": "Zlicz wystąpienia wszystkich dwucyfrowych fragmentów i uwzględnij remisy.",
  "points": 3,
  "topics": [
    "tablice-i-ciagi",
    "wyszukiwanie",
    "pliki"
  ],
  "difficulty": 2,
  "rationale": "Najrzadsze i najczęstsze pary cyfr: wymaga połączenia kilku operacji i samodzielnego doboru sposobu obliczeń.",
  "sheetPages": [
    13
  ],
  "gradingPages": [
    10,
    11
  ],
  "dataFiles": [
    "Dane_2305/pi.txt",
    "Dane_2305/pi_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>Wszystkich możliwych różnych fragmentów 2-cyfrowych jest dokładnie 100. Są nimi fragmenty 00, 01, 02, …, 99. Można sprawdzić, że np. 2-cyfrowy fragment równy 27 występuje w pliku pi.txt dokładnie 101 razy.</p>

<p>Znajdź fragmenty 2-cyfrowe, których liczba wystąpień w pliku pi.txt jest najmniejsza, oraz fragmenty 2-cyfrowe, których liczba wystąpień w pliku pi.txt jest największa. W wyniku podaj znalezione fragmenty 2-cyfrowe oraz liczby ich wystąpień.</p>

<p>W przypadku, gdy więcej niż jeden fragment występuje tyle samo razy, wypisz ten o mniejszej wartości liczbowej.</p>

<p>Dla danych w pliku pi_przyklad.txt poprawna odpowiedź to</p>

<pre>00 0
62 4</pre>

<p>(minimalna liczba wystąpień: fragment 00, liczba wystąpień 0; maksymalna liczba wystąpień: fragment 62, liczba wystąpień 4)</p>

<div class="practice-answer-slots" data-practice-editorial>
<div data-practice="najrzadszy">Najrzadszy fragment dwucyfrowy: …</div>
<div data-practice="min-wystapienia">Liczba wystąpień najrzadszego fragmentu: …</div>
<div data-practice="najczestszy">Najczęstszy fragment dwucyfrowy: …</div>
<div data-practice="max-wystapienia">Liczba wystąpień najczęstszego fragmentu: …</div>
</div>
