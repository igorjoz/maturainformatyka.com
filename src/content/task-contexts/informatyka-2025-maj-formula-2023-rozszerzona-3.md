---
{
  "examId": "informatyka-2025-maj-formula-2023-rozszerzona",
  "number": "3",
  "title": "Dron",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    10,
    11
  ]
}
---

<p>Tor lotu pewnego drona składa się z prostych odcinków. Lot rozpoczyna się w punkcie (0, 0), a kończy w punkcie (20000, 0). Dron poza startem i lądowaniem jest zawsze na wysokości większej od zera. Plik dron.txt zawiera 100 wierszy, w których zapisano dane dotyczące ruchu drona. W każdym wierszu jest zapisana para liczb całkowitych rozdzielonych znakiem spacji. Pierwsza liczba oznacza przemieszczenie drona (odległość) w poziomie od ostatniej pozycji – jest to zawsze liczba dodatnia. Druga liczba oznacza przemieszczenie w pionie od ostatniej pozycji. Jeśli druga liczba jest dodatnia, to dron wykonał ruch w górę, jeśli ujemna – w dół, a jeśli równa 0 – nie zmieniał wysokości.</p>

<p>Przykład 1. Dla przykładowych danych: </p><pre><code>3000 2000
2000 9000
5000 -7000
5000 4000
3000 6000
2000 -14000</code></pre><p></p><p>lot drona można zilustrować na wykresie:</p><figure><img src="/pliki/zadania/informatyka-2025-maj-formula-2023-rozszerzona/tor-drona.png" alt="Tor lotu drona przez punkty (0,0), (3000,2000), (5000,11000), (10000,4000), (15000,8000), (18000,14000), (20000,0)." width="920" height="422" /></figure><p>gdzie: x – odległość w poziomie od punktu startowego y – wysokość (odległość w pionie od punktu startowego) [A, B] – umieszczone na wykresie pary liczb oznaczające przemieszczenia drona odpowiednio w poziomie i w pionie.</p>

<p>Napisz program (lub kilka programów), który(-e) znajdzie(-dą) odpowiedzi dla podanych zadań. Każdą odpowiedź zapisz w pliku wyniki3.txt i poprzedź ją numerem oznaczającym zadanie.</p>

<p>Do Twojej dyspozycji jest plik dron_przyklad.txt zawierający 10 wierszy danych w opisanej postaci. Odpowiedzi dla pliku dron_przyklad.txt są podane pod każdym zadaniem. Pamiętaj, że Twój program musi ostatecznie zadziałać na pliku dron.txt zawierającym 100 wierszy danych.</p>

<p>Do oceny oddajesz:</p><ul><li>plik wyniki3.txt – zawierający odpowiedzi do zadań 3.1.–3.2. (odpowiedź do każdego zadania powinna być poprzedzona jego numerem)</li><li>pliki zawierające kody źródłowe Twojego(-ich) programu(-ów) o nazwach (uwaga: brak tych plików jest równoznaczny z brakiem rozwiązania zadania):</li></ul>
