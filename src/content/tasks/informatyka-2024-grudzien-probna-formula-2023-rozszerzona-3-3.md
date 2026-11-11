---
{
  "parentId": "informatyka-2024-grudzien-probna-formula-2023-rozszerzona-3",
  "number": "3.3",
  "title": "Różnica największego i najmniejszego układu cyfr",
  "summary": "Uporządkuj cyfry liczby, oblicz różnicę i porównaj ją z oryginałem.",
  "points": 3,
  "topics": [
    "sortowanie",
    "algorytmy-liczbowe",
    "pliki"
  ],
  "difficulty": 2,
  "rationale": "Różnica największego i najmniejszego układu cyfr: wymaga połączenia kilku operacji i samodzielnego doboru sposobu obliczeń.",
  "sheetPages": [
    8
  ],
  "gradingPages": [
    8,
    9
  ],
  "dataFiles": [
    "Dane-2412/liczby.txt",
    "Dane-2412/liczby_przyklad.txt"
  ],
  "dependencies": []
}
---

<p>Do każdej liczby w pliku stosujemy następującą procedurę: z jej czterech cyfr tworzymy największą możliwą oraz najmniejszą możliwą liczbę, po czym drugą z nich odejmujemy od pierwszej. Przykładowo: dla liczby 3151 największa możliwa liczba to 5311, a najmniejsza to 1135, a więc wynik – ich różnica – wynosi 4176. Jeśli w liczbie występują zera, traktujemy je tak samo jak inne cyfry (na przykład dla liczby 2047 różnica to 7420 − 0247 = 7173).</p>

<p>Dla każdej liczby rozstrzygnij, czy różnica otrzymana w wyniku zastosowania podanej procedury jest mniejsza, większa czy równa danej liczbie. Podaj, ile razy otrzymamy różnicę mniejszą, ile razy – większą, a ile razy – równą danej liczbie. Ponadto wypisz każdą liczbę, dla której otrzymuje się w wyniku zastosowania podanej procedury różnicę równą danej liczbie.</p>

<p>Dla pliku liczby_przyklad.txt otrzymamy 8 razy mniejszą różnicę i 12 razy większą różnicę. Ani razu różnica nie będzie równa danej liczbie.</p>

<div class="practice-slots"><div data-practice="mniejsze">Liczba mniejszych różnic: …</div><div data-practice="wieksze">Liczba większych różnic: …</div><div data-practice="rowne">Liczba równych różnic: …</div><div data-practice="liczba-rowna">Liczba równa swojej różnicy: …</div></div>
