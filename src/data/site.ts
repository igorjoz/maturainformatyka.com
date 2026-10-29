import promptLabIllustration from '../../images/prompt_lab_illustration.png';
import vulnerabilityVaultIllustration from '../../images/vulnerability_vault_illustration.png';

const introDuration = 30;

export const introMeeting = {
  duration: introDuration,
  format: 'online',
  costLabel: 'bezpłatnie',
  cta: 'Umów bezpłatne spotkanie',
  // Wklej pełny adres z atrybutu src kodu „Wbudowana strona rezerwacji” Google.
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
    { href: '#o-mnie', label: 'O mnie' },
    { href: '#opinie', label: 'Opinie' },
    { href: '#faq', label: 'FAQ' },
  ],
  hero: {
    heading: 'Matura z informatyki.',
    accent: 'Przygotowanie z planem.',
    description: 'Celujesz w wysoki wynik i studia techniczne? Pomogę Ci zrozumieć programowanie, uporządkować wiedzę i pewniej rozwiązywać zadania maturalne.',
  },
  steps: [
    { title: 'Poznajemy punkt startu.', text: `Zaczynamy od bezpłatnego, ${introMeeting.duration}-minutowego spotkania online. Poznajemy Twoje oczekiwania i wstępnie sprawdzamy poziom. To punkt wyjścia do dalszego przygotowania.`, tag: 'Wstępna diagnoza poziomu' },
    { title: 'Układamy Twój plan.', text: 'Dobieramy tematy i tempo do Twojego poziomu oraz czasu do matury. Wiesz, nad czym pracujesz i po co.', tag: 'Indywidualna ścieżka' },
    { title: 'Zamieniamy wiedzę w praktykę.', text: 'Rozwiązujemy zadania maturalne i pracujemy na autorskich materiałach. Analizujemy rozwiązania i uczymy się unikać typowych błędów.', tag: 'Zadania i informacja zwrotna' },
  ],
  subjects: [
    { code: '</>', title: 'Python lub C++', text: 'Od zrozumienia kodu do samodzielnego pisania rozwiązań. Pracujemy w wybranym przez Ciebie języku.' },
    { code: 'O(n)', title: 'Algorytmika', text: 'Rozkładanie problemu na kroki, dobór algorytmu i ocena, czy rozwiązanie jest poprawne i efektywne.' },
    { code: 'Σ', title: 'Excel', text: 'Analiza danych, formuły i wyciąganie wniosków. Arkusz jako narzędzie do rozwiązywania zadań.' },
    { code: 'SQL', title: 'Access', text: 'Relacje między tabelami, zapytania i wyszukiwanie informacji w bazach danych.' },
    { code: '01', title: 'Teoria informatyki', text: 'Zagadnienia potrzebne w zadaniach — ze zrozumieniem i w połączeniu z praktyką.' },
    { code: 'CKE', title: 'Zadania maturalne', text: 'Praca z arkuszami, czytanie poleceń i sprawdzanie rozwiązań pod kątem wymagań zadania.' },
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

export const faqs = [
  { question: 'Jak wygląda bezpłatne spotkanie zapoznawcze?', answer: `Spotkanie odbywa się ${introMeeting.format}, trwa ${introMeeting.duration} minut i jest bezpłatne. ${introMeeting.description} ${introMeeting.bookingUrl ? 'Wybierz dostępny termin w kalendarzu w sekcji spotkania zapoznawczego. Po rezerwacji otrzymasz e-mail z potwierdzeniem i linkiem do Google Meet.' : 'Aby umówić spotkanie, napisz do mnie lub zadzwoń.'}` },
  { question: 'Jak wyglądają regularne zajęcia?', answer: 'Pracujemy zgodnie z indywidualnym planem przygotowania, rozwiązując zadania maturalne i omawiając zagadnienia, które wymagają uwagi. Po zajęciach otrzymujesz podsumowanie, materiały i wskazówki do samodzielnej pracy.' },
  { question: 'Czy muszę już dobrze programować?', answer: 'Punkt startu ustalamy indywidualnie. Napisz, co już potrafisz i kiedy zdajesz maturę. Na tej podstawie porozmawiamy o zakresie przygotowania i realnym planie pracy.' },
  { question: 'Python czy C++ — w którym języku pracujemy?', answer: 'Przygotowuję zarówno w Pythonie, jak i C++. Wybór dopasujemy do Twojego dotychczasowego doświadczenia i planu przygotowania.' },
  { question: 'Czy otrzymam materiały do samodzielnej nauki?', answer: 'Tak. Po zajęciach otrzymujesz podsumowanie omawianych zagadnień, materiały do dalszej pracy i wskazówki, nad czym pracować między spotkaniami.' },
  { question: 'Ile trwają zajęcia i jak ustalamy terminy?', answer: `Możliwe długości spotkań to ${site.durations.join(', ')} minut. Cena zajęć online wynosi ${site.onlinePrice} zł za 60 minut. Terminy oraz koszt spotkań o innej długości ustalamy indywidualnie.` },
  { question: 'Czy możemy spotkać się stacjonarnie?', answer: `Tak, po wcześniejszym uzgodnieniu możliwe są zajęcia w Gdańsku i Kwidzynie. Cena zajęć stacjonarnych wynosi ${site.inPersonPrice} zł za 60 minut. Główną formą współpracy są zajęcia online.` },
];
