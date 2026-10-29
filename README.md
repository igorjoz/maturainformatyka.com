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

Gotowa witryna znajduje się w `dist/`. Do hostingu statycznego należy przekazać całą zawartość tego katalogu, wraz z `_astro/`. Publikacja i konfiguracja domeny nie są częścią implementacji.

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
