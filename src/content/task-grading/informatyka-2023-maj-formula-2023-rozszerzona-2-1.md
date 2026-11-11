---
{"answerStatus": "provided"}
---

## Odpowiedź CKE

### Przykładowe rozwiązanie

<pre tabindex="0"><code>b ← 1
poprzednia ← n mod 2
n ← n div 2
dopóki (n &gt; 0)
    cyfra ← n mod 2
    jeśli cyfra ≠ poprzednia
        b ← b + 1
        poprzednia ← cyfra
    n ← n div 2</code></pre>

## Zasady oceniania CKE

<p>Akceptowane są wszystkie odpowiedzi merytorycznie poprawne i spełniające warunki zadania.</p>

<p>W zadaniach praktycznych wszystkie wyniki muszą być odzwierciedleniem komputerowej realizacji obliczeń.</p>

<p>3 pkt – poprawny algorytm, w tym:</p>

<p>1 pkt – za poprawną pętlę,</p>

<p>1 pkt – za poprawne porównywanie kolejnych cyfr binarnych,</p>

<p>1 pkt – za poprawne zliczenie liczby bloków, w tym rozpoznawanie końca/początku kolejnego bloku i ustawienia początkowe.</p>

<p>0 pkt – odpowiedź niepoprawna albo brak odpowiedzi.</p>
