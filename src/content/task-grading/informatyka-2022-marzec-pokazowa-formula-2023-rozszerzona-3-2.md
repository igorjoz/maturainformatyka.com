---
{
  "answerStatus": "provided",
  "editorialNote": "W przykładowym rozwiązaniu rekurencyjnym CKE wywołania funkcji pomijają argument M, mimo trzech argumentów w jej nagłówku. Zachowano dosłowny zapis źródła."
}
---

## Odpowiedź CKE

### 1) Rozwiązanie w pseudojęzyku, używające rekursji:

<pre tabindex="0"><code>funkcja potęga(a, x, M)
    jeżeli x = 0
        wynik 1
    jeśli x mod 2 == 0:
        w = potęga(a, x/2)
        wynik w*w mod M
    jeśli x mod 2 == 1:
        w = potęga(a, (x-1)/2)
        zwróć wynik a*w*w mod M</code></pre>

### 2) Rozwiązanie w C++, metodą iteracyjną:

<pre tabindex="0"><code>int potega(int a, int x, int M)
{
    int w = 1;
    int z = a;
    while(x&gt;0)
    {
        if (x%2==1)
            w = w*z%M;
        z = z*z%M;
        x = x/2;
    }
    return w;
}</code></pre>

## Zasady oceniania CKE

4 pkt – za poprawny algorytm, w tym:

3 pkt – za poprawne obliczenie potęgi a<sup>x</sup> (w tym 1 punkt za warunki początkowe oraz 2 punkty za poprawną konstrukcję pętli z uwzględnieniem parzystości x)

1 pkt – za zwrócenie poprawnego wyniku.

2 pkt – za poprawny algorytm o złożoności większej niż logarytmiczna.

0 pkt – za podanie odpowiedzi niepoprawnej lub niepełnej albo brak odpowiedzi.
