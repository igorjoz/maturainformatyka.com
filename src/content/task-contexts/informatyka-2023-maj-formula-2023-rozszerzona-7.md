---
{
  "examId": "informatyka-2023-maj-formula-2023-rozszerzona",
  "number": "7",
  "title": "Gry planszowe",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    18,
    19
  ]
}
---

<p>Pewien serwis internetowy prowadzi ranking gier planszowych. Baza serwisu została zapisana w trzech plikach.</p>

<p>Plik gry.txt zawiera informacje o grach planszowych. W każdym wierszu zapisano: id_gry – unikatowy numer gry planszowej nazwa – tytuł gry planszowej kategoria  – kategorię, do jakiej została zakwalifikowana gra planszowa; każda gra</p>

<p>należy tylko do jednej kategorii.</p>

<p>Przykład:</p>

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><tbody><tr><th>id_gry</th><th>nazwa</th><th>kategoria</th></tr><tr><td>1</td><td>Wsiasc do Pociagu: Europa</td><td>familijna</td></tr><tr><td>2</td><td>Pandemia</td><td>kooperacyjna</td></tr><tr><td>3</td><td>Splendor</td><td>familijna</td></tr><tr><td>4</td><td>Dixit</td><td>familijna</td></tr><tr><td>5</td><td>Dobble</td><td>familijna</td></tr></tbody></table></div>

<p>Plik gracze.txt zawiera informacje o graczach. W każdym wierszu zapisano: id_gracza – unikatowy numer gracza imie – imię gracza nazwisko  – nazwisko gracza wiek – wiek gracza.</p>

<p>Przykład:</p>

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><tbody><tr><th>id_gracza</th><th>imie</th><th>nazwisko</th><th>wiek</th></tr><tr><td>1</td><td>Jozef</td><td>Gorecki</td><td>29</td></tr><tr><td>2</td><td>Przemyslaw</td><td>Mazurek</td><td>68</td></tr><tr><td>3</td><td>Cezary</td><td>Kaczmarczyk</td><td>41</td></tr><tr><td>4</td><td>Kornel</td><td>Wysocki</td><td>72</td></tr><tr><td>5</td><td>Eustachy</td><td>Gorecki</td><td>74</td></tr></tbody></table></div>

<p>Plik oceny.txt zawiera oceny wystawione grom przez poszczególnych graczy. W każdym wierszu pliku zapisano: id_gry – numer gry planszowej id_gracza  – numer gracza stan – zawiera jedną z możliwych wartości: posiada, chce kupic, sprzedal,</p>

<p>opisującą, czy użytkownik posiada daną grę, czy ją sprzedał lub czy zamierza ją zakupić ocena – zawiera ocenę gry przez gracza, wyrażoną liczbą całkowitą w zakresie od 0</p>

<p>do 10. Przykład:</p>

<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela lub wzór w poleceniu zadania"><table><tbody><tr><th>id_gry</th><th>id_gracza</th><th>stan</th><th>ocena</th></tr><tr><td>66</td><td>1</td><td>posiada</td><td>8</td></tr><tr><td>72</td><td>1</td><td>chce kupic</td><td>3</td></tr><tr><td>79</td><td>1</td><td>sprzedal</td><td>8</td></tr><tr><td>43</td><td>2</td><td>posiada</td><td>9</td></tr></tbody></table></div>

<p>We wszystkich plikach dane w wierszach są rozdzielone znakami tabulacji, a pierwszy wiersz w każdym pliku jest wierszem nagłówkowym.</p>

<p>Z wykorzystaniem danych zawartych w podanych plikach oraz dostępnych narzędzi informatycznych, podaj odpowiedzi do zadań 7.1.–7.4. Odpowiedzi zapisz w pliku wyniki7.txt, a każdą z nich poprzedź numerem odpowiedniego zadania.</p>

<p>Do oceny oddajesz: • plik tekstowy wyniki7.txt zawierający odpowiedzi do poszczególnych zadań (odpowiedź do każdego zadania powinna być poprzedzona jego numerem) • plik(i) zawierający(-e) komputerową realizację Twoich obliczeń o nazwie(-ach):</p>
