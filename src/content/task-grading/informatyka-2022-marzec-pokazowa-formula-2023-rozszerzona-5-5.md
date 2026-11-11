---
{
  "answerStatus": "provided",
  "editorialNote": "Przykładowe zapytania CKE zawierają zapisy Armatot, Id_armarota oraz Nazwa.statku, odmienne od nazw w poleceniu. Zachowano oba warianty dosłownie, bez poprawiania źródła."
}
---

## Odpowiedź CKE

<pre tabindex="0"><code>SELECT DISTINCT Statki.Nazwa_statku
FROM
Armatot JOIN Przybycia ON Armator.Id_armarota = Przybycia.Id_armatora
JOIN Statki ON Statki.Nr_IMO = Przybycia.Nr_IMO
WHERE Armator.Armator LIKE "XYZ";</code></pre>

<pre tabindex="0"><code>SELECT Statki.Nazwa.statku
FROM Armator JOIN Przybycia ON Armator.Id_armatora = Przybycia.Id_armatora
JOIN statki ON Statki.Nr_IMO = Przybycia.Nr_IMO
WHERE Armator.Armator LIKE "XYZ"
GROUP BY Statki.Nazwa_statku;</code></pre>

## Zasady oceniania CKE

2 pkt – za poprawną odpowiedź.

1 pkt – za odpowiedź bez uwzględnienia, że nazwy statków mają być różne.

1 pkt – za odpowiedź z innym błędem (np. brak warunku where lub w jednej z klauzul join itp.).

0 pkt – za podanie odpowiedzi niepoprawnej lub niepełnej albo brak odpowiedzi.
