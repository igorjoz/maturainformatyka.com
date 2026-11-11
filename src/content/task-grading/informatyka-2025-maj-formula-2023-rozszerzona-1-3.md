---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

<h3>Przykładowe rozwiązanie</h3>

<pre tabindex="0"><code>funkcja przestaw2(n)
    w ← 0
    p ← 1
    dopóki n &gt; 0 wykonuj
        r ← n mod 100
        a ← r div 10
        b ← r mod 10
        jeżeli n &gt; 9
            w ← p*a + 10*p*b + w
        w przeciwnym razie
            w ← p*b + w
        n ← n div 100
        p ← p*100
    zwróć w</code></pre>

## Zasady oceniania CKE

<p>4 pkt – za poprawny algorytm, w tym:</p><ul><li>1 pkt – za poprawne przypisanie wartości początkowych zmiennym w oraz p (potęga 100) oraz modyfikację zmiennej oznaczającej potęgę 100</li><li>1 pkt – za poprawną pętlę (warunek i dzielenie przez 100)</li><li>1 pkt – za poprawną zamianę cyfr</li><li>1 pkt – za otrzymanie poprawnego wyniku.</li></ul>

<p>0 pkt – odpowiedź niepoprawna albo brak rozwiązania.</p>

<h3>Uwagi ogólne CKE</h3>

<p>Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p><p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń.</p>
