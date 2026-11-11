---
{
  "answerStatus": "provided"
}
---

## Odpowiedź CKE

<pre tabindex="0"><code>SELECT Klienci.imie, Klienci.nazwisko, Sum(uslugi_dodatkowe.cena_uslugi)
FROM uslugi_dodatkowe INNER JOIN (Klienci INNER JOIN Noclegi ON Klienci.nr_dowodu
= Noclegi.nr_dowodu) ON uslugi_dodatkowe.id_pobytu = Noclegi.id_pobytu
GROUP BY Klienci.nr_dowodu, Klienci.imie, Klienci.nazwisko;</code></pre>

## Zasady oceniania CKE

2 pkt – odpowiedź poprawna.

1 pkt – odpowiedź z jednym błędem, np. brak grupowania, błąd przy JOIN itp.

0 pkt – odpowiedź niepoprawna albo brak rozwiązania.

Uwaga: Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.
