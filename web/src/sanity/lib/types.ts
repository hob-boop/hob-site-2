export type SanityImage = {
  url: string | null
  lqip: string | null
  dimensions: {width: number; height: number} | null
  alt: string | null
} | null

export type ResolvedLink = {
  label: string | null
  href: string | null
  newTab: boolean | null
} | null

export type KeyedLink = ResolvedLink & {_key: string}

export type SectionHeader = {
  kicker: string | null
  heading: string | null
  intro: string | null
} | null

export type Settings = {
  brandName: string | null
  brandTagline: string | null
  logo: SanityImage
  navLinks: KeyedLink[] | null
  bookingUrl: string | null
  bookingLabel: string | null
  cartUrl: string | null
  phone: string | null
  email: string | null
  mapUrl: string | null
  openingHours: {_key: string; days: string; hours: string}[] | null
  socialLinks: {_key: string; platform: string; url: string}[] | null
  footerBlurb: string | null
  footerVisitHeading: string | null
  footerVisitLinks: KeyedLink[] | null
  footerHoursHeading: string | null
  footerConnectHeading: string | null
  footerConnectLinks: KeyedLink[] | null
  legalLine: string | null
} | null

export type Home = {
  heroKicker: string | null
  heroHeadline: string | null
  heroSubtitle: string | null
  heroBadge: string | null
  heroSlides: (SanityImage & {_key: string})[] | null
  heroSlideSeconds: number | null
  trustItems: string[] | null
  welcomeKicker: string | null
  welcomeHeading: string | null
  welcomeParagraphs: string[] | null
  welcomeBadge: string | null
  welcomeVideoThumbnail: SanityImage
  welcomeVideoId: string | null
  welcomeVideoTag: string | null
  servicesHeader: SectionHeader
  servicesButton: ResolvedLink
  shopHeader: SectionHeader
  shopButton: ResolvedLink
  reviewsHeader: SectionHeader
  reviewsFootnote: string | null
  workHeader: SectionHeader
  galleryImages: (SanityImage & {_key: string})[] | null
  workButton: ResolvedLink
  mediaHeader: SectionHeader
  mediaTagline: string | null
  bookingKicker: string | null
  bookingHeading: string | null
  bookingSubtitle: string | null
} | null

export type Service = {
  _id: string
  title: string | null
  description: string | null
  icon: string | null
  priceType: string | null
  price: number | null
  enquireText: string | null
  link: string | null
}

export type Product = {
  _id: string
  title: string | null
  price: number | null
  url: string | null
  image: SanityImage
}

export type Review = {
  _id: string
  quote: string | null
  author: string | null
  source: string | null
  rating: number | null
}

export type MediaMention = {
  _id: string
  badgeBig: string | null
  badgeSmall: string | null
  title: string | null
  excerpt: string | null
  linkLabel: string | null
  url: string | null
}

export type HomepageData = {
  settings: Settings
  home: Home
  services: Service[]
  products: Product[]
  reviews: Review[]
  mediaMentions: MediaMention[]
}

export type ServicesPageData = {
  settings: Settings
  services: Service[]
}

export type ShopPageData = {
  settings: Settings
  products: Product[]
}

export type WorkPageData = {
  settings: Settings
  home: {
    workHeader: SectionHeader
    galleryImages: (SanityImage & {_key: string})[] | null
  } | null
}
