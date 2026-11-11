---
{
  "answerStatus": "provided",
  "editorialNote": "W odpowiedzi CKE użyto nazwy tabeli Armatorzy, a w poleceniu nazwy Armator. Zachowano dosłowny zapis zapytania ze źródła."
}
---

## Odpowiedź CKE

<pre tabindex="0"><code>SELECT Typ_dzialalnosci, COUNT (*)
FROM Armatorzy
GROUP BY Typ_dzialalnosci;</code></pre>

## Zasady oceniania CKE

2 pkt – za poprawną odpowiedź.

1 pkt – za odpowiedź, w której brakuje grupowania lub zliczania.

0 pkt – za podanie odpowiedzi niepoprawnej lub niepełnej albo brak odpowiedzi.
