---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

### Przykładowe rozwiązania

<pre tabindex="0"><code>SELECT Fotoradar.IdFotoradaru
FROM Fotoradar
LEFT JOIN Rejestr
ON Fotoradar.IdFotoradaru = Rejestr.IdFotoradaru
WHERE Rejestr.IdFotoradaru is Null;</code></pre>

<pre tabindex="0"><code>SELECT Fotoradar.IdFotoradaru
FROM Fotoradar
WHERE Fotoradar.IdFotoradaru NOT IN (SELECT Rejestr.IdFotoradaru FROM Rejestr)</code></pre>

## Zasady oceniania CKE

<p>Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p>

<p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń.</p>

<p>2 pkt – odpowiedź poprawna.</p>

<p>1 pkt – odpowiedź z jednym błędem, np. błąd przy rodzaju JOIN albo błąd w warunku po WHERE itp.</p>

<p>0 pkt – odpowiedź niepoprawna albo brak odpowiedzi.</p>
