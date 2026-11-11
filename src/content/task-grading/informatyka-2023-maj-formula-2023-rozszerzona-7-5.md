---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

### Przykładowe rozwiązanie

<pre tabindex="0"><code>SELECT Sum(cena)
FROM Gry
INNER JOIN Sklep ON Gry.id_gry = Sklep.id_gry
WHERE Gry.kategoria = &quot;logiczna&quot; and Sklep.promocja = true;</code></pre>

## Zasady oceniania CKE

<p>Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p>

<p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń.</p>

<p>2 pkt – odpowiedź poprawna (poprawny zapis zapytania zgodny z treścią zadania).</p>

<p>1 pkt – odpowiedź z jednym błędem np. brak jednego warunku albo błąd przy JOIN.</p>

<p>0 pkt – odpowiedź niepoprawna albo brak rozwiązania.</p>
