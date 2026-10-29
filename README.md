# Matura z informatyki — Igor Józefowicz

Statyczna witryna one page zbudowana w Astro, TypeScript i własnym CSS. Bez własnego backendu, formularza i analityki. Rezerwacje obsługuje osadzona strona Google Calendar. Font Manrope jest hostowany lokalnie; oryginalne zdjęcia pozostają w `images/`.

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

`npm test` sam buduje stronę i uruchamia tymczasowy podgląd na porcie 4322. Sześć testów sprawdza treść i metadane, obrazy, nawigację, przejście do rezerwacji, linki kontaktowe, menu mobilne oraz FAQ i podstawową nawigację bez JavaScriptu. Połączenie z Google Calendar jest zastępowane lokalną odpowiedzią; testy nie rezerwują terminów ani nie sprawdzają dostępności zewnętrznej usługi. Po błędzie zrzut ekranu i ślad wykonania trafiają do ignorowanego `test-results/`.

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
- `src/components/` — sekcje strony.
- `src/styles/global.css` — wygląd, responsywność i ograniczenie animacji.
- `src/components/PortraitScene.astro` — portret, orbity i warstwy kompozycji.
- `src/scripts/motion.ts` — reakcja na kursor i jednokrotne animacje wejścia.

Portret pochodzi z `images/portrait-art.png`. Responsywne AVIF/WebP i zapasowe PNG zachowują przezroczystość. Po zmianie oryginału odtwórz wariant z jasnym tłem dla Open Graph, a następnie uruchom build:

```bash
bash scripts/npm.sh exec -- node scripts/social-image.mjs
bash scripts/npm.sh run build
```

Adres w metadanych canonical i Open Graph to `https://maturainformatyka.com`, zgodnie z nazwą repozytorium. Można go zmienić przez `site` w `astro.config.mjs`. To wyłącznie metadane; domena i hosting nie są konfigurowane przez projekt.

Nawigacja, FAQ i kompletna kompozycja portretu działają bez JavaScriptu. Skrypty zamykają menu mobilne i dodają animacje. Orbity i plamy koloru poruszają się tylko w widocznych sekcjach; ruch zatrzymuje się w nieaktywnej karcie. Tła reagują na przewijanie, a linia procesu pokazuje jego postęp. Reakcja portretu i kart na kursor jest aktywna tylko dla precyzyjnego wskaźnika na ekranach szerszych niż 900 px. Na urządzeniach dotykowych karty mają krótkie podświetlenie. Ustawienie ograniczenia ruchu wyłącza animacje i parallax. Elementy pozostają czytelne przed uruchomieniem efektów. FAQ korzysta z natywnego `details` i płynnego rozwijania w przeglądarkach obsługujących tę funkcję.

Na końcu strony zielone cząsteczki i poświata wyróżniają panel bezpłatnego spotkania. Efekt uruchamia się raz po dotarciu do końca stopki, respektuje ograniczenie ruchu i zatrzymuje się poza widokiem. Przyciski bezpłatnego spotkania prowadzą do sekcji rezerwacji; działają również bez JavaScriptu strony.

## Rezerwacja spotkania w Google Calendar

1. Na komputerze w Google Calendar wybierz **Utwórz → Harmonogram spotkań**. Ustaw tytuł „Bezpłatne spotkanie zapoznawcze”, czas **30 minut**, własne godziny dostępności i strefę **Europe/Warsaw**. Jako punkt wyjścia można przyjąć minimum 24 godziny wyprzedzenia, dostępność na 30 dni naprzód i 15 minut buforu między spotkaniami.
2. Włącz sprawdzanie kalendarza pod kątem dostępności. Jako miejsce spotkania wybierz **Google Meet**, pozostaw spotkania bezpłatne i zapisz harmonogram. Dostępność dodatkowych funkcji, w tym przypomnień, zależy od abonamentu Google.
3. Przy stronie rezerwacji wybierz **Opcje udostępniania → Umieść na stronie internetowej → Pojedynczą stronę rezerwacji → Wbudowana strona rezerwacji**. Skopiuj pełny adres z atrybutu `src` wygenerowanego iframe (nie cały kod HTML ani skrócony link `calendar.app.google`). Nie udostępniaj publicznie swojego zwykłego kalendarza.
4. Wklej adres do `introMeeting.bookingUrl` w `src/data/site.ts`. W kodzie TypeScript zapisuj zwykłe `&`, a nie encje HTML `&amp;`. Uruchom check i build, a następnie opublikuj nowy katalog `dist/` używaną metodą hostingu.

Sekcja `#rezerwacja` znajduje się pod opisem spotkania. Iframe ładuje się leniwie; pod nim jest niezależny link „Otwórz rezerwację w Google” oraz kontakt mailowy i telefoniczny. Bez adresu rezerwacji strona wyświetla zaproszenie do kontaktu z gotową treścią e-maila, bez pustego iframe i niedziałających linków do Google. Podanie nieprawidłowego adresu zatrzymuje build.

Po podłączeniu prawdziwego harmonogramu sprawdź na komputerze i telefonie wybór terminu oraz dostępność linku alternatywnego. Zarezerwuj termin testowy z innego adresu e-mail i sprawdź potwierdzenie, wpis w kalendarzu, Google Meet oraz zniknięcie zarezerwowanego terminu z dostępności. Sprawdź też blokadę terminu zajętego przez inne wydarzenie oznaczone jako „Zajęty”. Na końcu anuluj rezerwację testową i usuń testowe wydarzenia.

Instrukcje Google: [tworzenie harmonogramu](https://support.google.com/calendar/answer/10729749?hl=pl), [osadzanie strony rezerwacji](https://support.google.com/calendar/answer/10733297?hl=pl).

## Logo i favicon

Oryginał znaku znajduje się w `images/logo-book-code.png`. Wariant nagłówka ma przycięte przezroczyste marginesy; favicony zachowują kolory i przezroczystość. Po zmianie oryginału odtwórz zasoby:

```bash
bash scripts/npm.sh exec -- node scripts/brand-assets.mjs
bash scripts/npm.sh run build
```

Skrypt zapisuje logo w `src/assets/logo-book-code.png`, favicony PNG 32 i 48 px oraz `public/favicon.ico` z rozmiarami 16, 32 i 48 px.
