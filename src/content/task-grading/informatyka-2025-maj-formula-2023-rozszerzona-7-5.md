---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

<h3>Przykładowe rozwiązanie</h3>

<pre tabindex="0"><code>SELECT DISTINCT Producent.nazwa
FROM Producent
INNER JOIN Laziki
ON Producent.kod_producenta = Laziki.kod_producenta
INNER JOIN Pomiary
ON Laziki.nr_lazika = Pomiary.nr_lazika
INNER JOIN Obszary
ON Obszary.kod_obszaru = Pomiary. kod_obszaru
WHERE Obszary.nazwa_obszaru = "Arcadia" and YEAR(Pomiary.data_pomiaru) = 2060;</code></pre>

## Zasady oceniania CKE

<p>2 pkt – odpowiedź poprawna.</p>

<p>1 pkt – odpowiedź z jednym błędem, np. błąd przy JOIN albo błąd w warunku po WHERE itp.</p>

<p>0 pkt – odpowiedź niepoprawna albo brak rozwiązania.</p>

<p>Uwaga: wymagamy uniwersalnego zapytania działającego dla dowolnych danych.</p>

<h3>Uwagi ogólne CKE</h3>

<p>Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p><p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń.</p>
