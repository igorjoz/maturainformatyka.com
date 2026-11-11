---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

### Przykładowe rozwiązanie

<pre tabindex="0"><code>m ← 0
p ← 1
dopóki n &gt; 0
    cyfra ← n mod 10
    jeżeli cyfra mod 2 ≠ 0
        m ← m + cyfra * p
        p ← p * 10
    n ← n div 10</code></pre>

## Zasady oceniania CKE

<p>Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p>

<p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń.</p>

<p>3 pkt – prawidłowy algorytm, w tym:</p>

<p>1 pkt – poprawny zapis pętli przechodzącej przez wszystkie cyfry liczby n</p>

<p>1 pkt – poprawne pobieranie cyfry i sprawdzanie nieparzystości</p>

<p>1 pkt – otrzymanie poprawnej liczby wynikowej m.</p>

<p>0 pkt – rozwiązanie błędne albo brak odpowiedzi.</p>
