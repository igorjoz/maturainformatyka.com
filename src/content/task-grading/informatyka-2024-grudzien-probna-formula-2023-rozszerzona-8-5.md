---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

### Przykładowe rozwiązanie

<pre tabindex="0"><code>SELECT Wlasciciele.imie, Wlasciciele.nazwisko
FROM Wlasciciele
INNER JOIN Samochody ON Wlasciciele.id_wlasciciela = Samochody.id_wlasciciela
WHERE Samochody.nr_rejestracyjny Like &quot;SH*&quot; AND Samochody.rok_produkcji=2020
ORDER BY Wlasciciele.nazwisko;</code></pre>

## Zasady oceniania CKE

<p>Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p>

<p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń.</p>

<p>2 pkt – odpowiedź poprawna.</p>

<p>1 pkt – za zapytanie z jednym błędem np. nieprawidłowy WHERE albo JOIN albo brak sortowania.</p>

<p>0 pkt – odpowiedź niepoprawna albo brak odpowiedzi.</p>
