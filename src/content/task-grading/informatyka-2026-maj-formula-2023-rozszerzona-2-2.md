---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

<h3>Przykładowa odpowiedź</h3>

<pre tabindex="0"><code>wpamieci ← 0
p ← 0
dopóki a &gt; 0 wykonuj
    cyfraa ← a mod 10
    cyfrab ← b mod 10
    suma ← cyfraa + cyfrab + wpamieci
    jeżeli suma ≥ 10
        wpamieci ← 1
        p ← p + 1
    w przeciwnym wypadku
        wpamieci ← 0
    a ← a div 10
    b ← b div 10</code></pre>

## Zasady oceniania CKE

<p>4 pkt – poprawny algorytm, w tym:</p><ul><li>1 pkt – poprawna pętla po liczbie cyfr a (i b)</li><li>1 pkt – poprawne pobieranie cyfr liczb a i b</li><li>1 pkt – poprawne liczenie poszczególnych sum cyfr liczb a i b z uwzględnieniem przeniesienia oraz obliczenie tego przeniesienia (kolejnej liczby w pamięci)</li><li>1 pkt – otrzymanie poprawnego wyniku (z uwzględnieniem ustawień początkowych).</li></ul>

<p>0 pkt – odpowiedź niepoprawna albo brak rozwiązania.</p>

<p>Uwaga: Za każde inne niż przedstawione powyżej, ale całkowicie poprawne rozwiązanie spełniające warunki zadania, przyznajemy maksymalną liczbę punktów.</p>

<h3>Uwagi ogólne CKE</h3>

<p>Ten dokument zawiera zasady oceniania oraz odpowiedzi i przykłady poprawnych rozwiązań zadań.</p><p>W zadaniach otwartych akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p><p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń. Realizacje komputerowe muszą być zapisane zgodnie z instrukcjami w arkuszu.</p>
