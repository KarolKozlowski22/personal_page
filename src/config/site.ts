export const siteConfig = {
  name: 'Karol Personal Site',
  title: 'Karol | Frontend Engineer',
  description:
    'Personal website covering education, current IT career, experience timeline, and podcast episodes.',
  url: 'https://example.com',
  author: 'Karol Kozlowski',
  role: 'DevOps Engineer @ Visa',
  location: 'Poland',
  podcastRssUrl:
    process.env.PODCAST_RSS_URL ?? 'https://feeds.simplecast.com/54nAGcIl',
  social: {
    github: 'https://github.com/KarolKozlowski22',
    linkedin: 'https://www.linkedin.com/in/karol-koz%C5%82owski-54ab6823a/',
    youtube: 'https://www.youtube.com/@RozmowyzKoz%C5%82em',
    spotify: 'https://open.spotify.com/show/3hpVmQuOU2Q0gZXUYgJFuM?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnkG8UG9fKY2R1H92_F8-skGyO9qsbl7UhD6dwTpUEx6nCdNGYUgsItroPjN0_aem_LFwt1H0s2CYJG_9GH_KPpg',
    instagram: 'https://www.instagram.com/rozmowyzkozlem'
  },
  email: 'kozlowskikarol02@gmail.com',
  voiceIntro: {
    imageSrc: '/karol-photo.jpg',
    imageAlt: 'Karol portrait',
    audioSrc: '/audio/intro.mp3'
  },
  experienceShowcase: {
    imageSrc: '/experience-photo.jpeg',
    imageAlt: 'Karol during engineering work'
  },
  educationGallery: {
    thesisPhoto: {
      src: '/education/thesis-photo.jpg',
      alt: 'Karol presenting bachelor thesis project'
    },
    aghLogo: {
      src: '/education/agh-logo.jpeg',
      alt: 'AGH University logo'
    },
    pwLogo: {
      src: '/education/pw-logo.jpeg',
      alt: 'Warsaw University of Technology logo'
    }
  },
  contactShowcase: {
    imageSrc: '/contact/contact-photo.jpg',
    imageAlt: 'Karol contact portrait'
  }
};

export type SiteConfig = typeof siteConfig;
