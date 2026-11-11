---
{
  "parentId": "informatyka-2024-maj-formula-2023-rozszerzona-7",
  "number": "7.4",
  "title": "Rabaty zależne od historii zakupów",
  "summary": "Oblicz rabaty w transakcjach na podstawie narastających zakupów klienta.",
  "points": 3,
  "topics": [
    "formuly",
    "analiza-danych",
    "analiza-i-symulacja"
  ],
  "difficulty": 3,
  "rationale": "Rabaty zależne od historii zakupów: wymaga złożonej analizy zależności, konstrukcji rozwiązania lub kontroli wielu warunków.",
  "sheetPages": [
    14,
    15
  ],
  "gradingPages": [
    16,
    17
  ],
  "dataFiles": [
    "Dane-NF-2405/jablka.txt"
  ],
  "dependencies": []
}
---

<p>Hurtownia ma system premiowania klientów hurtowych. Klient otrzymuje przy zakupie rabat, którego wysokość zależy od łącznej ilości jabłek zakupionych do tej pory przez tego klienta, wliczając w to jabłka zakupione w bieżącej transakcji. Wysokość rabatu za każdy kilogram w bieżącej transakcji wynosi: • 5 gr, jeśli klient dotychczas zakupił co najmniej 15 000 kg, ale mniej niż 20 000 kg • 10 gr, jeśli klient dotychczas zakupił co najmniej 20 000 kg. Podaj, w ilu transakcjach hurtownia udzieliła rabatu, oraz podaj łączną wartość tych rabatów w złotych.</p>

<p>Przykład: Załóżmy, że przed 1.04.2022 klient z NIP 128-29-15-591 zakupił łącznie 10 000 kg jabłek, klient 192-09-72-275 nabył 14 900 kg, a klient 140-36-11-559 – kupił 19 900 kg. Wtedy dla przykładowych danych 1.04.2022: 2022-04-01 Jonagold Z 128-29-15-591 470 2022-04-01 Jonagold Z 192-09-72-275 410 2022-04-01 Jonagored Z 140-36-11-559 242</p>

<p>• pierwszy klient, po dokonaniu transakcji 1.04.2022, będzie miał już 10 470 kg zakupionych jabłek i dla tej transakcji jeszcze nie należy się rabat • drugi klient, po dokonaniu transakcji 1.04.2022, będzie miał już 15 310 kg zakupionych jabłek, czyli podczas tej transakcji otrzyma 5 gr rabatu na każdy kilogram kupowanych tego dnia jabłek (5 gr * 410 = 20,50 zł  rabatu) • trzeci klient, po dokonaniu transakcji 1.04.2022, będzie miał już 20 142 kg zakupionych jabłek i podczas tej transakcji otrzyma 10 gr rabatu za każdy kilogram (10 gr * 242 = 24,20 zł rabatu).</p>

<div class="practice-slots"><div data-practice="transakcje">Liczba transakcji z rabatem: …</div><div data-practice="rabaty">Łączna wartość rabatów (zł): …</div></div>
