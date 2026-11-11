---
{
  "examId": "informatyka-2024-grudzien-probna-formula-2023-rozszerzona",
  "number": "2",
  "title": "Rekurencja",
  "sheetFile": "arkusz.pdf",
  "gradingFile": "ocenianie.pdf",
  "sheetPages": [
    6
  ]
}
---

<p>Przeanalizuj poniższą funkcję, której parametrami są nieujemna liczba całkowita x oraz dodatnia liczba całkowita 1 &lt; p &lt; 10.</p>

<pre><code>F(x, p) :
    jeżeli x = 0
        podaj wynik 0
    w przeciwnym przypadku
       c ← x mod p
       jeżeli c mod 2 = 1
            podaj wynik F( x div p, p ) + c
       w przeciwnym przypadku
            podaj wynik F( x div p, p ) – c</code></pre>

<p>gdzie: a mod b oznacza resztę z dzielenia liczby a przez liczbę b a div b oznacza dzielenie całkowite liczby a przez liczbę b</p>
