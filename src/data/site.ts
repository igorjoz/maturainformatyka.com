const introDuration = 30;

export const introMeeting = {
  duration: introDuration,
  format: 'online',
  costLabel: 'bezpłatnie',
  cta: 'Umów bezpłatne spotkanie',
  heading: 'Poznajmy się na darmowym spotkaniu online.',
  description: 'Podczas spotkania zapoznawczego porozmawiamy o Twoich oczekiwaniach i celu przygotowania do matury. Poznasz mój sposób pracy, a ja wstępnie sprawdzę Twój poziom i zaproponuję, jak mogę Ci pomóc.',
  points: ['Poznajemy się', 'Omawiamy Twój cel', 'Wstępnie sprawdzamy poziom'],
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
    { name: 'PromptLab', category: 'AI · LLM · RAG', description: 'Laboratorium do poznawania działania modeli językowych, chatbotów i systemów RAG.', url: 'https://igorjozef.com/' },
    { name: 'Vulnerability Vault', category: 'Cyberbezpieczeństwo', description: 'Miejsce do nauki hackingu i poznawania zagadnień cyberbezpieczeństwa.', url: 'https://igorjozefowicz.com/' },
  ],
  personal: 'https://igorjoz.com/pl',
  benefits: ['Zajęcia indywidualne 1:1', 'Plan dopasowany do Ciebie', 'Podsumowania i materiały', 'Wskazówki do pracy między zajęciami'],
};

export const faqs = [
  { question: 'Jak wygląda bezpłatne spotkanie zapoznawcze?', answer: `Spotkanie odbywa się ${introMeeting.format}, trwa ${introMeeting.duration} minut i jest bezpłatne. ${introMeeting.description} Aby ustalić termin, napisz do mnie lub zadzwoń.` },
  { question: 'Jak wyglądają regularne zajęcia?', answer: 'Pracujemy zgodnie z indywidualnym planem przygotowania, rozwiązując zadania maturalne i omawiając zagadnienia, które wymagają uwagi. Po zajęciach otrzymujesz podsumowanie, materiały i wskazówki do samodzielnej pracy.' },
  { question: 'Czy muszę już dobrze programować?', answer: 'Punkt startu ustalamy indywidualnie. Napisz, co już potrafisz i kiedy zdajesz maturę. Na tej podstawie porozmawiamy o zakresie przygotowania i realnym planie pracy.' },
  { question: 'Python czy C++ — w którym języku pracujemy?', answer: 'Przygotowuję zarówno w Pythonie, jak i C++. Wybór dopasujemy do Twojego dotychczasowego doświadczenia i planu przygotowania.' },
  { question: 'Czy otrzymam materiały do samodzielnej nauki?', answer: 'Tak. Po zajęciach otrzymujesz podsumowanie omawianych zagadnień, materiały do dalszej pracy i wskazówki, nad czym pracować między spotkaniami.' },
  { question: 'Ile trwają zajęcia i jak ustalamy terminy?', answer: `Możliwe długości spotkań to ${site.durations.join(', ')} minut. Cena zajęć online wynosi ${site.onlinePrice} zł za 60 minut. Terminy oraz koszt spotkań o innej długości ustalamy indywidualnie.` },
  { question: 'Czy możemy spotkać się stacjonarnie?', answer: `Tak, po wcześniejszym uzgodnieniu możliwe są zajęcia w Gdańsku i Kwidzynie. Cena zajęć stacjonarnych wynosi ${site.inPersonPrice} zł za 60 minut. Główną formą współpracy są zajęcia online.` },
];
