---
{
  "examId": "informatyka-2026-maj-formula-2023-rozszerzona",
  "number": "4",
  "title": "Korporacja",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    12,
    13
  ]
}
---

<p>W korporacji pracuje n osób, które na potrzeby zadania ponumerujemy liczbami 1, 2, …, n. Pracownik numer 1 jest prezesem korporacji, a każdy z pozostałych pracowników ma dokładnie jednego bezpośredniego przełożonego. Numer bezpośredniego przełożonego pracownika x jest zawsze mniejszy od numeru tego pracownika. Prezes korporacji nie ma żadnego przełożonego. Przełożonym pracownika jest jego bezpośredni przełożony i każdy przełożony tego bezpośredniego przełożonego. Jeśli x jest (bezpośrednim) przełożonym y, to powiemy, że y jest (bezpośrednim) podwładnym x. Prezes jest przełożonym każdego pracownika.</p><p>Przykład 1.</p><figure><img src="/pliki/zadania/informatyka-2026-maj-formula-2023-rozszerzona/hierarchia-korporacji.png" alt="Hierarchia: prezes 1 jest przełożonym 2 i 4; 2 jest przełożonym 5, 3 i 6; 3 jest przełożonym 7; 4 jest przełożonym 8. Strzałki wskazują przełożonych." width="754" height="338" /></figure><p>Rysunek 1. Przykład hierarchii w korporacji (strzałki wskazują na bezpośrednich przełożonych). Przełożonymi pracownika 7 są pracownicy 3, 2 i 1. Bezpośrednim przełożonym pracownika 7 jest pracownik 3. Pracownik 3 (podobnie jak 5 oraz 6) jest bezpośrednim podwładnym pracownika 2, a podwładnymi pracownika 2 są pracownicy 3, 5, 6 i 7.</p>

<p>Informacja do zadań 4.2.–4.4. Dany jest plik korpo.txt zawierający n = 50 000 liczb, który opisuje strukturę korporacji. W pierwszym wierszu jest liczba 0 oznaczająca brak przełożonego dla prezesa korporacji, który ma numer 1. W i-tym (2 ≤ i ≤ 50 000) wierszu pliku jest numer pracownika, który jest bezpośrednim przełożonym pracownika i.</p>

<p>Przykład 2. Zapis w pliku dla przykładowej korporacji (Rysunek 1) miałby postać:</p>

<pre><code>0
1
2
1
2
2
3
4</code></pre>

<p>Napisz program(-y), który(-e) znajdzie(-ą) i da(dzą) odpowiedzi do podanych zadań. Odpowiedzi zapisz w pliku wyniki4.txt, a każdą z nich poprzedź numerem odpowiedniego zadania.</p>

<p>Do Twojej dyspozycji jest również plik korpo_przyklad.txt, w identycznym formacie, w którym bezpośrednim przełożonym pracowników 2 i 3 jest pracownik 1, a wszystkich innych – pracownik 3. Odpowiedzi dla danych z tego pliku są podane pod treściami zadań.</p>

<p>Uwaga: Pamiętaj, że Twój program musi ostatecznie działać dla pliku korpo.txt.</p>

<p>Do oceny oddajesz:</p><ul><li>plik wyniki4.txt – zawierający odpowiedzi do zadań 4.2.–4.4. (odpowiedź do każdego zadania powinna być poprzedzona jego numerem)</li><li>pliki zawierające kody źródłowe Twojego(-ich) programu(-ów) o nazwach (uwaga: brak tych plików jest równoznaczny z brakiem rozwiązania zadania):</li></ul>
