---
{
  "answerStatus": "provided",
  "editorialNote": "W przykładowym zapytaniu CKE wzorce LIKE zapisano z użyciem typograficznych cudzysłowów. Zachowano zapis oryginału; przy uruchamianiu zapytania należy uwzględnić składnię używanego systemu baz danych."
}
---

## Odpowiedź CKE

<h3>Przykładowe rozwiązanie</h3>

<pre tabindex="0"><code>SELECT Produkty.IdProduktu, Nazwa
FROM Opis_transakcji
JOIN
Produkty
ON Opis_transakcji.IdProduktu = Produkty.IdProduktu
JOIN
Kategorie
ON Kategorie.IdKategorii = Produkty.IdKategorii
WHERE
NazwaKategorii = "spozywcze" AND Opis LIKE ”%do ekspresu kolbowego%”;</code></pre>

## Zasady oceniania CKE

<p>2 pkt – odpowiedź poprawna, w tym:</p><ul><li>1 pkt – wybór pól i połączenie tabel</li><li>1 pkt – warunki wyszukiwania.</li></ul>

<p>0 pkt – odpowiedź niepoprawna albo brak odpowiedzi.</p>

<h3>Uwagi ogólne CKE</h3>

<p>Ten dokument zawiera zasady oceniania oraz odpowiedzi i przykłady poprawnych rozwiązań zadań.</p><p>W zadaniach otwartych akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p><p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń. Realizacje komputerowe muszą być zapisane zgodnie z instrukcjami w arkuszu.</p>
