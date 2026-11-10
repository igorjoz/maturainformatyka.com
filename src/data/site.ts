import promptLabIllustration from '../../images/prompt_lab_illustration.png';
import vulnerabilityVaultIllustration from '../../images/vulnerability_vault_illustration.png';
import algorithmIllustration from '../../images/algorithm.png';
import dataIllustration from '../../images/relations.png';

const introDuration = 30;

export const introMeeting = {
  duration: introDuration,
  format: 'online',
  costLabel: 'bezpłatnie',
  cta: 'Umów bezpłatne spotkanie',
  // The booking URL is the complete src attribute from the Google booking-page embed.
  bookingUrl: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ25WZbeDzESmQuNbh_KRaelOGxbBfgdW267RQf88-KVEOg6ysqbp2CJwDwL09aipDRayW0GvPJD',
  heading: 'Poznajmy się na darmowym spotkaniu online.',
  description: 'Podczas spotkania zapoznawczego porozmawiamy o Twoich oczekiwaniach i celu przygotowania do matury. Poznasz mój sposób pracy, a ja wstępnie sprawdzę Twój poziom i zaproponuję, jak mogę Ci pomóc.',
  agenda: [
    { title: 'Poznajemy Twój cel', description: 'Porozmawiamy o tym, kiedy zdajesz maturę i jaki wynik chcesz osiągnąć.' },
    { title: 'Omawiamy trudności', description: 'Przyjrzymy się temu, co już potrafisz i które tematy sprawiają Ci najwięcej problemów.' },
    { title: 'Ustalamy kierunek przygotowań', description: 'Zaproponuję, od czego zacząć i jak mogę pomóc Ci w dalszej nauce.' },
  ],
  practicalQuestions: [
    { question: 'Czy muszę coś przygotować?', answer: 'Nie potrzebujesz specjalnego przygotowania. Jeśli chcesz, możesz przynieść pytania albo zadanie, które sprawia Ci trudność.' },
    { question: 'Czy muszę włączyć kamerę?', answer: 'Kamera jest opcjonalna. Możesz dołączyć do rozmowy tak, jak jest Ci wygodnie.' },
    { question: 'Czy muszę od razu zdecydować się na zajęcia?', answer: 'Nie. Spotkanie służy temu, żebyśmy się poznali. O dalszej współpracy możesz spokojnie zdecydować po rozmowie.' },
  ],
  contactInvitation: `Umów bezpłatne, ${introDuration}-minutowe spotkanie zapoznawcze online.`,
};

export const site = {
  name: 'Igor Józefowicz',
  title: 'Matura z informatyki — Igor Józefowicz',
  description: 'Indywidualne przygotowanie do matury z informatyki online. Python, C++, algorytmika, Excel i Access. Diagnoza poziomu, plan nauki i mentoring z Igorem Józefowiczem.',
  email: 'igor@jozefowicz.pl',
  phone: '+48 535 743 042',
  phoneHref: '+48535743042',
  listing: 'https://www.e-korepetycje.net/igorjozefowicz/informatyka',
  onlinePrice: 180,
  inPersonPrice: 240,
  durations: [45, 60, 90, 120],
  navigation: [
    { href: '#wspolpraca', label: 'Współpraca' },
    { href: '#zakres', label: 'Zakres' },
    { href: '/arkusze/', label: 'Arkusze maturalne' },
    { href: '#o-mnie', label: 'O mnie' },
    { href: '#opinie', label: 'Opinie' },
    { href: '#oferta', label: 'Oferta' },
    { href: '#faq', label: 'FAQ' },
  ],
  hero: {
    heading: 'Matura z informatyki.',
    accent: 'Przygotowanie z planem.',
    description: 'Celujesz w wysoki wynik i studia techniczne? Pomogę Ci zrozumieć programowanie, uporządkować wiedzę i pewniej rozwiązywać zadania maturalne.',
  },
  steps: [
    { title: 'Poznajemy punkt startu.', text: `Na bezpłatnej, ${introMeeting.duration}-minutowej rozmowie poznajemy Twój cel i sprawdzamy, od czego zacząć.`, tag: 'Diagnoza' },
    { title: 'Układamy Twój plan.', text: 'Dobieramy tematy i tempo do Twojego poziomu oraz czasu do matury. Wiesz, nad czym pracujesz i po co.', tag: 'Indywidualna ścieżka' },
    { title: 'Rozwiązujesz coraz więcej.', text: 'Pracujemy na zadaniach maturalnych. Rozumiesz rozwiązania, analizujesz błędy i dostajesz wskazówki do dalszej pracy.', tag: 'Praktyka' },
  ],
  subjects: [
    { id: 'programowanie', example: 'Policz liczby spełniające podany warunek.', lessonHref: '#przyklad-podstawowy', code: '</>', title: 'Python lub C++', text: 'Od zrozumienia kodu do samodzielnego pisania rozwiązań. Pracujemy w wybranym przez Ciebie języku.' },
    { id: 'algorytmika', example: 'Opisz kolejne kroki porządkowania liczb i oceń liczbę porównań.', code: 'O(n)', title: 'Algorytmika', text: 'Rozkładanie problemu na kroki, dobór algorytmu i ocena, czy rozwiązanie jest poprawne i efektywne.' },
    { id: 'excel', example: 'Oblicz średnią wyników i wskaż wartości powyżej średniej.', code: 'Σ', title: 'Excel', text: 'Analiza danych, formuły i wyciąganie wniosków. Arkusz jako narzędzie do rozwiązywania zadań.' },
    { id: 'access', example: 'Połącz uczniów z ich wynikami i wybierz osoby spełniające warunek.', code: 'SQL', title: 'SQL i Access', text: 'Relacje między tabelami, zapytania SQL i tworzenie kwerend w Accessie. Łączysz dane, filtrujesz wyniki i odpowiadasz na pytania.' },
    { id: 'teoria', code: '1010', base: 2, title: 'Teoria informatyki', text: 'Zagadnienia potrzebne w zadaniach — ze zrozumieniem i w połączeniu z praktyką.' },
    { id: 'matura', code: 'CKE', title: 'Zadania maturalne', text: 'Praca z arkuszami, czytanie poleceń i sprawdzanie rozwiązań pod kątem wymagań zadania.' },
  ],
  about: {
    title: 'Uczę informatyki, którą sam wykorzystuję.',
    paragraphs: [
      'Nazywam się Igor Józefowicz. Jestem inżynierem informatyki i absolwentem Politechniki Gdańskiej. Łączę nauczanie z tworzeniem własnych projektów technologicznych.',
      'Na zajęciach zależy mi na tym, żebyś rozumiał, skąd bierze się rozwiązanie. Przygotowanie do egzaminu może być jednocześnie początkiem solidnych podstaw pod studia i dalszą naukę programowania.',
    ],
  },
  projects: [
    { name: 'PromptLab', category: 'AI · LLM · RAG', description: 'Laboratorium do poznawania działania modeli językowych, chatbotów i systemów RAG.', url: 'https://igorjozef.com/', image: promptLabIllustration, imageAlt: 'Dokumenty połączone ze szklanym modułem przetwarzania informacji i kartą odpowiedzi.' },
    { name: 'Vulnerability Vault', category: 'Cyberbezpieczeństwo', description: 'Miejsce do nauki hackingu i poznawania zagadnień cyberbezpieczeństwa.', url: 'https://igorjozefowicz.com/', image: vulnerabilityVaultIllustration, imageAlt: 'Otwarty sejf z modułami systemu i lupą wskazującą przerwane połączenie.' },
  ],
  personal: 'https://igorjoz.com/pl',
  benefits: ['Zajęcia indywidualne 1:1', 'Plan dopasowany do Ciebie', 'Podsumowania i materiały', 'Wskazówki do pracy między zajęciami'],
};

export const testimonials = [
  { name: 'Wiktor', date: '2026-06-08', dateLabel: '8 czerwca 2026', rating: 5, quote: 'Polecam, solidna instytucja, indywidualne podejście, pasja i odpowiednie podejście czynią cuda, dziękuję!!! Warto spróbować i poczuć moc wiedzy i pomocy.' },
  { name: 'Maria', date: '2026-01-25', dateLabel: '25 stycznia 2026', rating: 5, quote: 'Nauczyciel z pasją i ogromną wiedzą. Tłumaczy jasno i konkretnie, dzięki czemu nawet trudne zagadnienia stają się zrozumiałe. Z pełnym przekonaniem polecam.' },
  { name: 'Aleksandra', date: '2025-10-15', dateLabel: '15 października 2025', rating: 5, quote: 'Wystawiam bardzo dobrą opinię z poleceniem. Bardzo się cieszę, że tu trafiłam i dziękuję za zaoferowaną mi pomoc.' },
];

export const maturaExample = {
  sourceLabel: 'CKE · maj 2026 · zadanie 7.1 · 3 pkt',
  context: 'Zadanie „Staw”: dane pogodowe z pliku staw.txt (Formuła 2023).',
  quote: 'Utwórz zestawienie średnich miesięcznych temperatur w zaokrągleniu do jednego miejsca po przecinku.',
  steps: [
    { label: 'Dane', text: 'Odczytujemy daty i temperatury, rozpoznajemy miesiące.' },
    { label: 'Metoda', text: 'Obliczamy średnie miesięczne i przygotowujemy wykres kolumnowy.' },
    { label: 'Sprawdzenie', text: 'Kontrolujemy zaokrąglenie, dobór danych, tytuł, opisy osi i oznaczenie miesięcy.' },
  ],
  sources: [
    { label: 'Pełne polecenie — PDF', url: '/pliki/matury/informatyka-2026-maj-formula-2023-rozszerzona/arkusz.pdf#page=16' },
    { label: 'Zasady oceniania — PDF', url: '/pliki/matury/informatyka-2026-maj-formula-2023-rozszerzona/ocenianie.pdf#page=14' },
  ],
};

export const subjectGroups = [
  {
    number: '01', title: 'Programowanie i algorytmy',
    description: 'Od „nie wiem, jak zacząć” do własnego rozwiązania. Najpierw rozumiesz problem, potem dobierasz narzędzia i piszesz kod.',
    image: algorithmIllustration,
    imageAlt: 'Nieuporządkowane słupki przechodzą przez moduł decyzji i tworzą rosnący ciąg.',
    subjects: site.subjects.slice(0, 2),
  },
  {
    number: '02', title: 'Praca z danymi',
    description: 'W tabelach zaczynasz dostrzegać zależności. Uczysz się zadawać danym właściwe pytania i wyciągać z nich wnioski.',
    image: dataIllustration,
    imageAlt: 'Powiązane tabele, arkusz z wyróżnionymi komórkami i przestrzenny wykres słupkowy.',
    subjects: site.subjects.slice(2, 4),
  },
];

export const lessonExample = {
  title: 'Tak pracujemy nad zadaniem.',
  description: 'Nie zaczynamy od gotowego kodu. Najpierw szukamy pomysłu, sprawdzamy go na przykładzie i dopiero wtedy zapisujemy rozwiązanie.',
  examples: [
    {
      id: 'przyklad-podstawowy', level: 'Podstawy', algorithm: 'parity' as const,
      task: 'Policz, ile liczb w podanym ciągu jest parzystych.',
      values: [3, 8, 5, 12, 7, 4], highlightedIndices: [1, 3, 5],
      sequenceCaption: 'Wyróżnione liczby spełniają warunek parzystości.',
      hint: 'Liczba jest parzysta, gdy reszta z dzielenia przez 2 wynosi 0. Jak zapisać ten warunek w kodzie?',
      code: 'numbers = [3, 8, 5, 12, 7, 4]\neven_count = 0\n\nfor number in numbers:\n    if number % 2 == 0:\n        even_count += 1\n\nprint(even_count)  # 3',
      result: 3, resultLabel: '3 liczby parzyste',
      conclusion: 'Każdą liczbę sprawdzasz raz. Ten sam schemat — przejście po danych i sprawdzenie warunku — wykorzystasz w wielu kolejnych zadaniach.',
      actions: [{ targetId: 'przyklad-trudniejszy', label: 'Proste? Spróbuj trudniejszego →' }],
    },
    {
      id: 'przyklad-trudniejszy', level: 'Krok dalej', algorithm: 'kadane' as const,
      task: 'Znajdź największą sumę niepustego spójnego fragmentu ciągu.',
      values: [-2, 3, -1, 4, -5, 2], highlightedIndices: [1, 2, 3],
      sequenceCaption: 'Wyróżniony fragment [3, −1, 4] ma sumę 6. Fragment musi zawierać kolejne elementy — nie można wybierać dowolnych liczb.',
      hint: 'Czy lepiej przedłużyć dotychczasowy fragment, czy zacząć nowy od bieżącej liczby?',
      code: 'numbers = [-2, 3, -1, 4, -5, 2]\ncurrent_sum = best_sum = numbers[0]\n\nfor number in numbers[1:]:\n    current_sum = max(\n        number,\n        current_sum + number\n    )\n    best_sum = max(\n        best_sum, current_sum\n    )\n\nprint(best_sum)  # 6',
      result: 6, resultLabel: 'Największa suma: 6',
      conclusion: 'Sprawdzanie wszystkich fragmentów można zastąpić jednym przejściem po ciągu. Algorytm Kadane’a zapamiętuje najlepszą sumę kończącą się w bieżącym miejscu i najlepszy wynik do tej pory. Złożoność: O(n).',
      actions: [
        { targetId: 'przyklad-podstawowy', label: '← Wróć do podstaw' },
        { targetId: 'przyklad-wyzwanie', label: 'Jeszcze za prosto? Sprawdź wyzwanie →' },
      ],
    },
    {
      id: 'przyklad-wyzwanie', level: 'Wyzwanie', algorithm: 'lis' as const,
      task: 'Wyznacz długość najdłuższego ściśle rosnącego podciągu w niepustym ciągu liczb.',
      values: [3, 1, 5, 2, 6, 4, 9], highlightedIndices: [1, 3, 5, 6],
      sequenceCaption: 'Wyróżniony podciąg [1, 2, 4, 9] ma długość 4. Możesz pomijać elementy, ale musisz zachować ich kolejność. Każda następna liczba musi być większa.',
      hint: 'Jeśli podciąg ma kończyć się na bieżącej liczbie, który wcześniejszy wynik możesz przedłużyć?',
      code: 'numbers = [3, 1, 5, 2, 6, 4, 9]\nlengths = [1] * len(numbers)\n\nfor i in range(len(numbers)):\n    for j in range(i):\n        if numbers[j] < numbers[i]:\n            lengths[i] = max(\n                lengths[i],\n                lengths[j] + 1\n            )\n\nprint(max(lengths))  # 4',
      result: 4, resultLabel: 'Największa długość: 4',
      conclusion: 'To programowanie dynamiczne: dla każdej pozycji zapamiętujesz długość najdłuższego rosnącego podciągu, który się na niej kończy. Przeglądasz wcześniejsze mniejsze elementy i przedłużasz najlepszy z ich wyników. Kod oblicza długość; wyróżnione liczby pokazują jeden z poprawnych podciągów. Złożoność: O(n²).',
      actions: [{ targetId: 'przyklad-trudniejszy', label: '← Wróć do poprzedniego' }],
    },
  ],
};

export const faqs = [
  { question: 'Jak wygląda bezpłatne spotkanie zapoznawcze?', answer: `Przez ${introMeeting.duration} minut rozmawiamy online o Twoim celu, poziomie i planie nauki. Nie musisz decydować się na zajęcia. ${introMeeting.bookingUrl ? 'Termin wybierzesz w kalendarzu powyżej. Potwierdzenie i link do Google Meet otrzymasz e-mailem.' : 'Aby umówić spotkanie, napisz do mnie lub zadzwoń.'}` },
  { question: 'Jak wyglądają regularne zajęcia?', answer: 'Pracujemy zgodnie z indywidualnym planem przygotowania, rozwiązując zadania maturalne i omawiając zagadnienia, które wymagają uwagi. Po zajęciach otrzymujesz podsumowanie, materiały i wskazówki do samodzielnej pracy.' },
  { question: 'Czy muszę już dobrze programować?', answer: 'Punkt startu ustalamy indywidualnie. Napisz, co już potrafisz i kiedy zdajesz maturę. Na tej podstawie porozmawiamy o zakresie przygotowania i realnym planie pracy.' },
  { question: 'Python czy C++ — w którym języku pracujemy?', answer: 'Przygotowuję zarówno w Pythonie, jak i C++. Wybór dopasujemy do Twojego dotychczasowego doświadczenia i planu przygotowania.' },
  { question: 'Czy otrzymam materiały do samodzielnej nauki?', answer: 'Tak. Po zajęciach otrzymujesz podsumowanie omawianych zagadnień, materiały do dalszej pracy i wskazówki, nad czym pracować między spotkaniami.' },
  { question: 'Ile trwają zajęcia i jak ustalamy terminy?', answer: `Możliwe długości spotkań to ${site.durations.join(', ')} minut. Cena zajęć online wynosi ${site.onlinePrice} zł za 60 minut. Terminy oraz koszt spotkań o innej długości ustalamy indywidualnie.` },
  { question: 'Czy możemy spotkać się stacjonarnie?', answer: `Tak, po wcześniejszym uzgodnieniu możliwe są zajęcia w Gdańsku i Kwidzynie. Cena zajęć stacjonarnych wynosi ${site.inPersonPrice} zł za 60 minut. Główną formą współpracy są zajęcia online.` },
];
