# Matura z informatyki — Igor Józefowicz

Statyczna witryna one page zbudowana w React, Astro, TypeScript i własnym CSS. Wszystkie sekcje, ikony i dekoracje są komponentami TSX; Astro generuje dokument HTML, metadane i zoptymalizowane obrazy. Bez własnego backendu, formularza i analityki. Rezerwacje obsługuje osadzona strona Google Calendar. Font Manrope jest hostowany lokalnie; oryginalne zdjęcia pozostają w `images/`.

## Uruchomienie

Wymagany Node.js 22.12 lub nowszy w obsługiwanej przez Astro wersji LTS.

```bash
npm ci
npm run dev
```

Adres lokalny: `http://127.0.0.1:4321`.

### Docker

Uruchomienie gotowej strony w tle (wymagany Docker z Compose):

```bash
docker compose up --build -d
```

Strona jest dostępna pod **http://localhost:4321**. Obraz buduje i sprawdza projekt w Node.js, a gotowe pliki statyczne serwuje Nginx. Port jest udostępniony tylko lokalnie. Po zmianach kodu ponownie uruchom powyższe polecenie, aby przebudować obraz.

```bash
docker compose ps
docker compose logs --tail=50 web
docker compose down
```

### WSL: npm z Windows i błąd ENOTEMPTY

Jeżeli `command -v npm` pokazuje `/mnt/c/Program Files/nodejs/npm`, terminal korzysta z Windowsowego npm na Linuxowym katalogu. Ścieżka `C:\Users\...\npm-cache` w logu również wskazuje na Windowsowe npm.

W tym checkoutcie przygotowany został lokalny runtime Node.js dla Linuxa w ignorowanym `.tools/node/`. Uruchamiaj:

```bash
bash scripts/npm.sh ci
bash scripts/npm.sh run dev
```

### Podgląd gotowej strony

```bash
python3 -m http.server 4321 --bind 0.0.0.0 --directory dist
```

Następnie otwórz **http://localhost:4321** w przeglądarce Windows. Zatrzymanie serwera: Ctrl+C.

## Weryfikacja i build

```bash
npm run check
npm run build
npm run preview
```

Gotowa witryna znajduje się w `dist/`. Do hostingu statycznego należy przekazać całą zawartość tego katalogu, wraz z `_astro/`. Publikację na Hostingerze obsługuje opisany poniżej workflow GitHub Actions.

### Testy

Podstawowe testy przeglądarkowe korzystają z Playwright i Chromium. Po `npm ci` zainstaluj przeglądarkę (jednorazowo, ponownie po aktualizacji Playwright):

```bash
npx playwright install --with-deps chromium
npm test
```

`npm test` sam buduje stronę i uruchamia tymczasowy podgląd na porcie 4322. Testy sprawdzają treść i metadane, obrazy, nawigację, rezerwację, kontakt, trzy poziomy przykładu lekcji i ich przełączanie, oznaczenie teorii, kolejność oferty i kalendarza, menu mobilne, klawiaturę, ograniczenie ruchu i działanie bez JavaScriptu. Laboratorium ma testy kroków, cofania, resetu, odtwarzania co 1200 ms, zatrzymywania poza sekcją i w ukrytej karcie oraz zmiany poziomów. Osobne testy algorytmów porównują wyniki z niezależnymi obliczeniami, uwzględniają liczby ujemne i remisy oraz sprawdzają niezależność migawek. Testy kolorowania Pythona sprawdzają kolory tokenów, kontrast i zachowanie tekstu oraz wcięć przy zaznaczaniu kodu, także bez JavaScriptu. Układ strony i otwartego laboratorium jest sprawdzany dla szerokości 360, 390, 768, 1024, 1366 i 1440 px, również pod kątem odsłonięcia kotwic pod przyklejonym nagłówkiem. Połączenie z Google Calendar jest zastępowane lokalną odpowiedzią; testy nie rezerwują terminów ani nie sprawdzają dostępności zewnętrznej usługi. Po błędzie zrzut ekranu i ślad wykonania trafiają do ignorowanego `test-results/`.

## Automatyczne wdrożenia na Hostingera

Workflow `.github/workflows/deploy.yml` instaluje zależności i Chromium, uruchamia `npm run check` oraz `npm test` (wraz z buildem), a po ich powodzeniu wysyła zawartość `dist/` przez rsync po SSH. Błąd testów zatrzymuje wdrożenie. Docker nie jest wymagany na hostingu.

- Push do `master` uruchamia sprawdzanie, build, testy i wdrożenie.
- Pull request do `master` uruchamia sprawdzanie, build i testy, bez dostępu do sekretów wdrożeniowych.
- Ręczne uruchomienie jest dostępne w **Actions → Deploy to Hostinger → Run workflow**. Wybierz gałąź `master`. Zaznaczenie `dry_run` sprawdza połączenie i plan transferu bez zmiany plików na serwerze. Ręczne uruchomienie z innej gałęzi wykonuje sprawdzanie, build i testy.
- Wdrożenia nie wykonują się równocześnie. Grafiki, style i skrypty są wysyłane przed `index.html`. Stare pliki, w tym `.htaccess` i wcześniejsze zasoby `_astro/`, pozostają na serwerze; automatyczne wdrożenie ich nie usuwa.

### Konfiguracja sekretów

W repozytorium GitHub otwórz **Settings → Secrets and variables → Actions → New repository secret** i dodaj:

| Sekret | Wartość |
| --- | --- |
| `HOSTINGER_HOST` | Adres IP lub nazwa serwera z hPanel, bez `ssh://` i bez portu. |
| `HOSTINGER_PORT` | Port SSH z hPanel, zwykle `65002` na hostingu współdzielonym. |
| `HOSTINGER_USER` | Nazwa użytkownika SSH z hPanel. |
| `HOSTINGER_PATH` | Istniejący, zapisywalny katalog strony, np. `/home/u123456789/domains/maturainformatyka.com/public_html`. Użyj rzeczywistej ścieżki z konta. |
| `HOSTINGER_SSH_KEY` | Cały klucz prywatny bez hasła, wraz z liniami `BEGIN` i `END`. Nie plik `.pub`. |
| `HOSTINGER_KNOWN_HOSTS` | Pełny wpis z pliku `known_hosts` dla tego samego hosta i portu, np. `[ADRES_IP]:65002 ssh-ed25519 AAAA…`. Nie sam odcisk `SHA256:…`. |

W Hostingerze włącz SSH i dodaj odpowiadający klucz publiczny w **Dostęp SSH → Dodaj klucz SSH**. Przed zapisaniem `HOSTINGER_KNOWN_HOSTS` porównaj odcisk klucza serwera z odciskiem wyświetlanym w hPanel. Nie zapisuj klucza prywatnego w repozytorium.

Jeśli plik hosta został już zaakceptowany i zapisany w Windows PowerShell, jego zawartość skopiujesz poleceniem:

```powershell
Get-Content "$HOME\.ssh\hostinger_known_hosts" | Set-Clipboard
```

### Pierwsze uruchomienie i aktualizacje

1. Zrób kopię obecnego katalogu strony w Hostingerze. Wdrożenie nadpisuje pliki o tych samych nazwach.
2. Dodaj sześć sekretów i wyślij workflow oraz `scripts/deploy-hostinger.sh` do repozytorium. Push do `master` uruchomi wdrożenie automatycznie; jeśli chcesz zacząć od próby, dodaj pliki najpierw na innej gałęzi i uzupełnij sekrety dopiero po scaleniu workflow do `master`, następnie uruchom ręcznie z `dry_run`.
3. Po udanym teście uruchom workflow na `master` bez `dry_run`. Sprawdź stronę, ilustracje i kalendarz pod domeną. Jeśli Hostinger lub CDN pokazuje poprzednią wersję, wyczyść jego cache.
4. Następne pushe do `master` publikują aktualizacje automatycznie. Brak sekretu, błąd klucza, połączenia lub builda zatrzymuje wdrożenie. Dziennik jest dostępny w zakładce **Actions**.

Skrypt `scripts/deploy-hostinger.sh` odczytuje powyższe zmienne środowiskowe. Można go uruchomić po lokalnym buildzie na Linuxie/WSL z zainstalowanymi SSH i rsync; `DEPLOY_DRY_RUN=true bash scripts/deploy-hostinger.sh` wykonuje próbę. Skrypt usuwa tymczasowe pliki kluczy po zakończeniu i nie akceptuje nieznanych kluczy serwera automatycznie. Transfer nie jest atomową podmianą całego katalogu i nie wykonuje kopii zapasowej hostingu.

## Edycja

- `src/data/site.ts` — treści, ceny, kontakt, projekty i FAQ.
- `src/components/` — sekcje, ikony i dekoracje w React; `types.ts` definiuje dane przekazywane do komponentów.
- `src/components/LessonExample.tsx` — trzy poziomy demonstracyjnego przykładu pracy nad zadaniem, z treścią i kodem w HTML oraz przełączaniem w tej samej karcie.
- `src/components/Subjects.tsx` — dwa ilustrowane obszary nauki oraz teoria i zadania maturalne.
- `src/styles/global.css` — style bazowe, responsywność i ograniczenie animacji; `refresh.css` — odświeżona kompozycja, odstępy i kontrolki.
- `src/components/PortraitScene.tsx` — portret, orbity i warstwy kompozycji.
- `src/hooks/useSectionMotion.ts` — lokalne efekty kursora, przewijania i wejścia, wraz ze sprzątaniem obserwatorów, nasłuchów i timerów.
- `src/scripts/lesson-trace.ts` — kroki trzech algorytmów: dane, linie kodu, zmienne i objaśnienia.
- `src/components/LessonExample.tsx` — reducer poziomu i odtwarzacza, pauzowanie i przywracanie pełnego rozwiązania.
- `src/styles/lesson-lab.css` — wygląd panelu sterowania i wyróżnienia aktualnego kroku.

Ilustracje zakresu nauki pochodzą z `images/algorithm.png` (algorytmy) i `images/relations.png` (dane). Oryginały mają 1536 × 1024 px. Podczas builda Astro tworzy warianty AVIF, WebP i zapasowe JPEG o szerokości 360, 640, 960 i 1280 px, z jakością 75. Przeglądarka dobiera plik do szerokości ilustracji i gęstości ekranu; `sizes` uwzględnia także dwukolumnowy układ na tablecie. Obrazy ładują się leniwie i są dekodowane asynchronicznie. Projekty w sekcji „O mnie” używają małych miniatur. Sekcja oferty ma kotwicę `#oferta`, przykład lekcji — `#przyklad`. Rezerwacja znajduje się pod ofertą, przed FAQ; wszystkie główne przyciski prowadzą do `#rezerwacja`.

Treści trzech poziomów przykładu zapisano w `lessonExample.examples` w `src/data/site.ts`; lista `actions` określa przyciski przejścia i powrotu. Poziomy to „Podstawy” (liczenie parzystych liczb), „Krok dalej” (największa suma spójnego fragmentu, algorytm Kadane’a) oraz „Wyzwanie” (długość najdłuższego ściśle rosnącego podciągu, programowanie dynamiczne O(n²)). Wyzwanie oblicza długość 4, a wyróżnione liczby `[1, 2, 4, 9]` pokazują jeden z poprawnych podciągów. Po zmianie fokus trafia na polecenie, a przewijanie uwzględnia nagłówek i ograniczenie ruchu. Bez JavaScriptu wszystkie przykłady są widoczne kolejno, z linkami między nimi. Oznaczenie teorii ma postać `1010` z indeksem dolnym `2`, zapisanym w danych jako `base`.

Kod Python w `solution.py` używa angielskich nazw (`numbers`, `even_count`, `current_sum`, `best_sum`, `lengths`). Pole `code` pozostaje zwykłym tekstem; `src/build/page-props.ts` koloruje składnię przez Shiki podczas builda i przekazuje serializowalne tokeny do React. `PythonCode` renderuje tokeny oraz numerowane linie, również dla wersji bez JavaScriptu. Shiki nie jest wysyłane do przeglądarki. Motyw `css-variables` korzysta z palety `--astro-code-*` w `.lesson-code` w `src/styles/global.css`. Bloki zachowują wcięcia, zaznaczanie i kopiowanie tekstu, fokus klawiatury oraz własne przewijanie poziome. Czcionka ma 14 px na komputerze i 13 px na telefonie.

### React i hydratacja

`src/pages/index.astro` jest cienką warstwą dokumentu i kompozycji. Oficjalna integracja `@astrojs/react` generuje HTML komponentów podczas builda, a React przejmuje interakcje w przeglądarce. Header i Hero używają `client:load`; laboratorium, zakres, współpraca, projekty, opinie, oferta i kontakt — `client:visible` z wyprzedzeniem 200 px. FAQ, rezerwacja i stopka nie wymagają hydratacji. Nie ma routera ani globalnego magazynu stanu.

Obrazy i tokeny kodu przygotowuje wyłącznie moduł builda. `ResponsivePicture` renderuje gotowe warianty AVIF/WebP i obraz zapasowy. Komponenty otrzymują dane przez typowane właściwości; narzędzia przetwarzania obrazów i Shiki pozostają poza paczkami klienta.

Pierwszy render React jest zgodny z HTML z builda. Pełne przykłady i opisy są widoczne przed hydratacją oraz bez skryptów; kontrolki wymagające JavaScriptu pojawiają się dopiero po uruchomieniu komponentu. Laboratorium korzysta z `useReducer`, zakładki mają niezależny stan kart. Efekty sekcji używają referencji, obserwatorów i zmiennych CSS; ruch kursora nie powoduje renderowania React. Wszystkie efekty sprzątają zasoby przy demontażu.

Wyniki odbioru migracji i porównanie rozmiaru paczek: [docs/react-migration.md](docs/react-migration.md). `npm run report:bundle` mierzy sumę plików JavaScriptu w `dist/_astro/`, wraz z rozmiarem gzip.

### Interaktywny zakres przygotowania

W sekcji `#zakres` pod ilustracjami są zakładki „Python lub C++” / „Algorytmika” oraz „Excel” / „SQL i Access”. Pierwszy temat jest widoczny od początku. Kliknięcie podmienia opis i przykładowe polecenie w tym samym miejscu, bez zamykania panelu i zmiany wysokości karty. Obie pary działają niezależnie. Strzałki lewo/prawo przełączają tematy (z zawijaniem), Home/End wybierają pierwszy/ostatni; fokus pozostaje na zakładce. Tab prowadzi do panelu i jego linków. Przy programowaniu link prowadzi do podstawowego przykładu lekcji.

Panele zajmują wspólną komórkę siatki CSS, która rezerwuje wysokość dłuższego opisu także po zmianie szerokości. Nieaktywny panel jest niewidoczny (`visibility: hidden`), ma `aria-hidden` i `inert`, więc nie jest dostępny dla klawiatury ani czytników ekranu. Bez JavaScriptu wszystkie tematy są widoczne kolejno z nagłówkami, a zakładki pozostają ukryte. Ograniczenie ruchu wyłącza przenikanie; stan nie jest zapisywany między wizytami. Teoria i zadania maturalne mają osobne karty z przykładami widocznymi od razu.

Karta „Zadania maturalne” przedstawia fragment zadania 7.1 „Staw” z oficjalnego arkusza CKE z maja 2026 (Formuła 2023, 3 pkt). Cytat jest oddzielony od wskazówek „Jak pracujemy nad zadaniem”. Linki prowadzą do strony 16 arkusza i strony 14 zasad oceniania na serwerze CKE. Metryka, kontekst, cytat, wskazówki i adresy są zapisane w `maturaExample` w `src/data/site.ts`. Strona nie pobiera dokumentów ani danych egzaminacyjnych; testy sprawdzają adresy źródeł bez wywoływania serwera CKE.

Tytuł i wstęp obszaru są nad ilustracją; bezpośrednio pod nią są zakładki i opis tematu w osobnej karcie z wewnętrznym odstępem. Ilustracje reagują na precyzyjny kursor przechyleniem, zbliżeniem i poświatą. Dotyk daje krótkie podświetlenie. Dwa punkty na każdej ilustracji wybierają temat w tym samym panelu co zakładki; oba sposoby sterowania współdzielą stan. Kliknięcie punktu przenosi fokus na aktywny panel bez automatycznego skoku przeglądarki, a krótka animacja (420 ms) odsłania opis tylko w potrzebnym zakresie, zachowując minimum 96 px ilustracji nad nim. W bardzo niskim oknie priorytetem jest kontekst ilustracji i początek opisu. Animacja śledzi zmiany położenia karty podczas ładowania, ale nie wyrównuje strony po zakończeniu; ruch kółkiem, dotyk lub klawiatura ją przerywają. Przy ograniczeniu ruchu przejście jest natychmiastowe. Dotyczy to także ponownego wyboru tego samego tematu; same zakładki nie przewijają strony. Punkty mają co najmniej 44 × 44 px. Obrys fokusu jest tylko dla klawiatury i mieści się wewnątrz panelu.

Treści i identyfikatory tematów są w `src/data/site.ts`, stan, pozycje punktów i sterowanie w `src/components/Subjects.tsx`, a wygląd w `src/styles/subjects.css`. Testy `tests/subjects.spec.ts` obejmują przełączanie, klawiaturę, dostępność, wersję bez skryptów i stabilną wysokość przy pięciu szerokościach ekranu. Dodatkowe testy `tests/visual-effects.spec.ts` sprawdzają punkty, kursor, dotyk i wstęgi na końcu strony.

### Interaktywne laboratorium

Każdy poziom początkowo pokazuje kompletne rozwiązanie. „Prześledź rozwiązanie” otwiera krok 0; dostępne są poprzedni i następny krok, odtwarzanie/pauza, powrót do początku i przycisk pokazania pełnego rozwiązania. Przejście do innego poziomu przywraca podsumowania. Bezpośredni link do identyfikatora przykładu otwiera odpowiedni poziom.

Pole `algorithm` w danych wybiera `parity`, `kadane` albo `lis`. Generator otrzymuje dokładnie te same `values`, które renderuje komponent, i tworzy niezależne migawki z indeksami danych, numerami linii kodu, zmiennymi i objaśnieniem. Komponent React dodaje `data-code-line` do linii tokenów przygotowanych podczas builda, bez zmiany tekstu kodu. Po zmianie treści Python należy dopasować numery linii w generatorze. To demonstracja na ustalonych danych; strona nie wykonuje kodu Python. Rekonstrukcja wyróżnionego podciągu LIS służy ilustracji, natomiast pokazany kod oblicza jego długość.

Odtwarzanie przechodzi o jeden krok co 1200 ms. Zatrzymuje się na końcu, przy zmianie poziomu, opuszczeniu sekcji i ukryciu karty; wymaga ręcznego wznowienia. Przy ograniczeniu ruchu pozostaje ręczne sterowanie krokami, bez odtwarzania w czasie i animowanych przejść. Przyciski obsługują klawiaturę i mają co najmniej 44 × 44 px, a objaśnienie kroku jest komunikatem `aria-live`.

### Oprawa i animacje

Nagłówek pokazuje postęp czytania i oznacza aktualną sekcję przez `aria-current="location"`. Te wskazówki działają także przy ograniczeniu ruchu. Sekcje korzystają ze wspólnych parametrów `--motion-reaction` (200 ms), `--motion-enter` (550 ms) i `--ease-out`.

Świetlny fragment orbity, aktywowane etapy współpracy i sekwencyjne wejście korzyści uzupełniają istniejące animacje. Karty projektów otrzymują poświatę pod kursorem i niewielkie przybliżenie miniatury. Efekty kursora działają wyłącznie na ekranach szerszych niż 900 px z precyzyjnym wskaźnikiem; dotyk ma krótkie podświetlenie. Grafiki pozostają lokalnymi obrazami, a dekoracje używają CSS i SVG.

Portret pochodzi z `images/portrait-art.png`. Responsywne AVIF/WebP i zapasowe PNG zachowują przezroczystość. Po zmianie oryginału odtwórz wariant z jasnym tłem dla Open Graph, a następnie uruchom build:

```bash
bash scripts/npm.sh exec -- node scripts/social-image.mjs
bash scripts/npm.sh run build
```

Adres w metadanych canonical i Open Graph to `https://maturainformatyka.com`, zgodnie z nazwą repozytorium. Można go zmienić przez `site` w `astro.config.mjs`. To wyłącznie metadane; domena i hosting nie są konfigurowane przez projekt.

Nawigacja, FAQ i kompletna kompozycja portretu działają bez JavaScriptu. Skrypty zamykają menu mobilne i dodają animacje. Orbity i plamy koloru poruszają się tylko w widocznych sekcjach; ruch zatrzymuje się w nieaktywnej karcie. Tła reagują na przewijanie, a linia procesu pokazuje jego postęp. Reakcja portretu i kart na kursor jest aktywna tylko dla precyzyjnego wskaźnika na ekranach szerszych niż 900 px. Na urządzeniach dotykowych karty mają krótkie podświetlenie. Ustawienie ograniczenia ruchu wyłącza animacje i parallax. Elementy pozostają czytelne przed uruchomieniem efektów. FAQ korzysta z natywnego `details` i płynnego rozwijania w przeglądarkach obsługujących tę funkcję.

Na końcu strony duże wstęgi SVG w kolorach zieleni i miedzi rozwijają się wokół sekcji kontaktu. Towarzyszą im opadające konfetti i poświata panelu bezpłatnego spotkania. Efekt uruchamia się raz po dotarciu do końca stopki; wstęgi pozostają widoczne po animacji. Dekoracje są pod treścią, nie przechwytują kliknięć, respektują ograniczenie ruchu i zatrzymują się poza widokiem. Na telefonie mają mniejszą intensywność i mniej cząsteczek. Wygląd definiuje `src/styles/celebration.css`, a SVG i cząsteczki — `src/components/ContactCelebration.tsx`. Przyciski spotkania prowadzą do rezerwacji i działają również bez JavaScriptu strony.

## Rezerwacja spotkania w Google Calendar

1. Na komputerze w Google Calendar wybierz **Utwórz → Harmonogram spotkań**. Ustaw tytuł „Bezpłatne spotkanie zapoznawcze”, czas **30 minut**, własne godziny dostępności i strefę **Europe/Warsaw**. Jako punkt wyjścia można przyjąć minimum 24 godziny wyprzedzenia, dostępność na 30 dni naprzód i 15 minut buforu między spotkaniami.
2. Włącz sprawdzanie kalendarza pod kątem dostępności. Jako miejsce spotkania wybierz **Google Meet**, pozostaw spotkania bezpłatne i zapisz harmonogram. Dostępność dodatkowych funkcji, w tym przypomnień, zależy od abonamentu Google.
3. Przy stronie rezerwacji wybierz **Opcje udostępniania → Umieść na stronie internetowej → Pojedynczą stronę rezerwacji → Wbudowana strona rezerwacji**. Skopiuj pełny adres z atrybutu `src` wygenerowanego iframe (nie cały kod HTML ani skrócony link `calendar.app.google`). Nie udostępniaj publicznie swojego zwykłego kalendarza.
4. Wklej adres do `introMeeting.bookingUrl` w `src/data/site.ts`. W kodzie TypeScript zapisuj zwykłe `&`, a nie encje HTML `&amp;`. Uruchom check i build, a następnie opublikuj nowy katalog `dist/` używaną metodą hostingu.

Sekcja `#rezerwacja` znajduje się pod ofertą, przed FAQ. Zawiera opis spotkania, agendę i pytania praktyczne. Iframe ładuje się leniwie; pod nim jest niezależny link „Otwórz rezerwację w Google” oraz kontakt mailowy i telefoniczny. Bez adresu rezerwacji strona wyświetla zaproszenie do kontaktu z gotową treścią e-maila, bez pustego iframe i niedziałających linków do Google. Podanie nieprawidłowego adresu zatrzymuje build.

Po podłączeniu prawdziwego harmonogramu sprawdź na komputerze i telefonie wybór terminu oraz dostępność linku alternatywnego. Zarezerwuj termin testowy z innego adresu e-mail i sprawdź potwierdzenie, wpis w kalendarzu, Google Meet oraz zniknięcie zarezerwowanego terminu z dostępności. Sprawdź też blokadę terminu zajętego przez inne wydarzenie oznaczone jako „Zajęty”. Na końcu anuluj rezerwację testową i usuń testowe wydarzenia.

Instrukcje Google: [tworzenie harmonogramu](https://support.google.com/calendar/answer/10729749?hl=pl), [osadzanie strony rezerwacji](https://support.google.com/calendar/answer/10733297?hl=pl).

## Logo i favicon

Oryginał znaku znajduje się w `images/logo-book-code.png`. Wariant nagłówka ma przycięte przezroczyste marginesy; favicony zachowują kolory i przezroczystość. Po zmianie oryginału odtwórz zasoby:

```bash
bash scripts/npm.sh exec -- node scripts/brand-assets.mjs
bash scripts/npm.sh run build
```

Skrypt zapisuje logo w `src/assets/logo-book-code.png`, favicony PNG 32 i 48 px oraz `public/favicon.ico` z rozmiarami 16, 32 i 48 px.
