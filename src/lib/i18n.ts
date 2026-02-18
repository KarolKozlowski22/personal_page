export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const dictionaries = {
  pl: {
    nav: {
      home: 'Start',
      about: 'O mnie',
      experience: 'Doświadczenie',
      education: 'Edukacja',
      podcast: 'Podcast',
      contact: 'Kontakt',
      openMenu: 'Otwórz menu'
    },
    footer: {
      tagline: 'Spokój, kierunek, działanie.'
    },
    language: {
      pl: 'PL',
      en: 'EN'
    },
    home: {
      title:
        'Buduję nowoczesne systemy IT: od Linux i bezpieczeństwa po CI/CD, Kubernetes i automatyzację.',
      description:
        'Jestem inżynierem DevOps. Na tej stronie znajdziesz moje doświadczenie zawodowe, edukację, projekty oraz podcast „Rozmowy z Kozłem”.',
      viewExperience: 'Zobacz doświadczenie',
      contact: 'Kontakt',
      openSection: 'Otwórz sekcję',
      highlights: {
        education: 'Zaplecze akademickie, certyfikaty i obszary specjalizacji.',
        career: 'Aktualna rola, wpływ i odpowiedzialność inżynierska.',
        podcast: 'Odcinki, proces myślenia i edukacja społeczności.'
      }
    },
    voice: {
      title: 'Kim jestem?',
      helper: 'Kliknij play, posłuchaj mojej historii i czytaj napisy w trakcie.',
      placeholder: 'Napisy pojawią się tutaj podczas odtwarzania nagrania.',
      play: 'Play',
      pause: 'Pauza',
      restart: 'Restart'
    },
    about: {
      title: 'O Mnie',
      description: 'Jak pracuję, co cenię i z jakich technologii korzystam na co dzień.',
      bioTitle: 'Bio',
      bioText:
        'Nazywam się {author}, pracuję jako {role} i mieszkam w {location}. Skupiam się na klarownym myśleniu produktowym, utrzymywalnym kodzie i pragmatycznych decyzjach inżynierskich.',
      valuesTitle: 'Wartości',
      stackTitle: 'Stack Technologiczny',
      values: ['Myślenie produktowe', 'Mocna architektura frontendu', 'Dostępne doświadczenia'],
      stack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Node.js', 'Testy']
    },
    education: {
      title: 'Edukacja',
      description: 'Wykształcenie formalne, specjalistyczne szkolenia i certyfikaty.',
      galleryTitle: 'Galeria Edukacyjna',
      galleryDescription: 'Zdjęcie z pracy inżynierskiej oraz logotypy uczelni.'
    },
    experience: {
      title: 'Oś Kariery',
      description: 'Poprzednie i obecne role, rezultaty oraz kluczowe technologie.',
      remote: 'Zdalnie',
      photoTitle: 'Zdjęcie Profilowe',
      photoDescription:
        'To miejsce możesz wykorzystać na dodatkowe zdjęcie związane z Twoją pracą. Podmień plik w konfiguracji i odśwież stronę.'
    },
    contact: {
      title: 'Kontakt',
      description: 'Napisz bezpośrednio lub połącz się przez social media.',
      getInTouch: 'Skontaktuj się',
      open: 'Otwórz',
      email: 'Email'
    },
    podcast: {
      title: 'Podcast',
      description: 'Dlaczego nagrywam, o czym mówię i gdzie możesz słuchać.',
      featured: 'Najnowsze odcinki na YouTube',
      watchOnYoutube: 'Oglądaj na YouTube',
      platforms: 'Platformy',
      episodes: 'Odcinki',
      total: 'łącznie',
      fallback: 'Odcinki są chwilowo niedostępne. Sprawdź profil Spotify, gdy synchronizacja feedu wróci.',
      shorts: 'Shorty',
      card: {
        episode: 'Odcinek',
        details: 'Szczegóły',
        listen: 'Słuchaj'
      },
      detail: {
        badge: 'Odcinek Podcastu',
        listenAudio: 'Słuchaj Audio',
        episodePage: 'Strona Odcinka',
        spotifyEmbed: 'Spotify Embed',
        youtubeEmbed: 'YouTube Embed'
      }
    },
    notFound: {
      title: 'Nie znaleziono strony',
      description: 'Strona jest niedostępna lub odcinek nie został jeszcze zsynchronizowany.',
      back: 'Wróć na start'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      education: 'Education',
      podcast: 'Podcast',
      contact: 'Contact',
      openMenu: 'Open menu'
    },
    footer: {
      tagline: 'Clarity, direction, execution.'
    },
    language: {
      pl: 'PL',
      en: 'EN'
    },
    home: {
      title:
        'I build modern IT systems across Linux, security, CI/CD, Kubernetes, and automation.',
      description:
        'I am a DevOps Engineer. This site covers my professional experience, education, projects, and my podcast “Rozmowy z Kozłem”.',
      viewExperience: 'View Experience',
      contact: 'Contact',
      openSection: 'Open section',
      highlights: {
        education: 'Academic background, certifications, and focus areas.',
        career: 'Current role, impact, and engineering ownership.',
        podcast: 'Episodes, thought process, and community learning.'
      }
    },
    voice: {
      title: 'Who I am',
      helper: 'Press play to hear my story and follow the subtitles as they appear.',
      placeholder: 'Subtitles will appear here while the recording is playing.',
      play: 'Play',
      pause: 'Pause',
      restart: 'Restart'
    },
    about: {
      title: 'About',
      description: 'How I work, what I value, and the technologies I use daily.',
      bioTitle: 'Bio',
      bioText:
        'I am {author}, a {role} based in {location}. I focus on clear product thinking, maintainable code, and practical engineering decisions.',
      valuesTitle: 'Values',
      stackTitle: 'Tech Stack',
      values: ['Product mindset', 'Strong frontend architecture', 'Accessible experiences'],
      stack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Node.js', 'Testing']
    },
    education: {
      title: 'Education',
      description: 'Formal education, specialized training, and certifications.',
      galleryTitle: 'Education Gallery',
      galleryDescription: 'Bachelor thesis photo and university logos.'
    },
    experience: {
      title: 'Career Timeline',
      description: 'Past and present roles, outcomes, and key technologies.',
      remote: 'Remote',
      photoTitle: 'Profile Photo',
      photoDescription:
        'Use this section for an additional work-related photo. Replace the image path in config and refresh the page.'
    },
    contact: {
      title: 'Contact',
      description: 'Reach out directly or connect on social platforms.',
      getInTouch: 'Get in touch',
      open: 'Open',
      email: 'Email'
    },
    podcast: {
      title: 'Podcast',
      description: 'Why I record, what I cover, and where to listen.',
      featured: 'Latest YouTube Episodes',
      watchOnYoutube: 'Watch on YouTube',
      platforms: 'Platforms',
      episodes: 'Episodes',
      total: 'total',
      fallback: 'Episodes are currently unavailable. Please use the Spotify profile while feed sync is down.',
      shorts: 'Shorts',
      card: {
        episode: 'Episode',
        details: 'Details',
        listen: 'Listen'
      },
      detail: {
        badge: 'Podcast Episode',
        listenAudio: 'Listen Audio',
        episodePage: 'Episode Page',
        spotifyEmbed: 'Spotify Embed',
        youtubeEmbed: 'YouTube Embed'
      }
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you requested is unavailable or the episode has not been synced yet.',
      back: 'Back to home'
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
