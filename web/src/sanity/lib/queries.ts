import {defineQuery} from 'next-sanity'

/** Everything an <Image> needs, including the blur placeholder. */
const imageFragment = /* groq */ `
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions,
  alt,
  hotspot,
  crop
`

/** Resolves the link object's toggle down to a single href. */
const linkFragment = /* groq */ `
  label,
  newTab,
  "href": select(
    kind == "anchor" => "/#" + anchor,
    kind == "page"   => "/" + internalPage,
    kind == "phone"  => "tel:" + phone,
    kind == "email"  => "mailto:" + email,
    url
  )
`

/** Every field the header and footer need, on every page. */
const settingsFragment = /* groq */ `
  brandName,
  brandTagline,
  logo{${imageFragment}},
  navLinks[]{_key, ${linkFragment}},
  bookingUrl,
  bookingLabel,
  cartUrl,
  phone,
  email,
  mapUrl,
  googleRating,
  googleRatingCount,
  openingHours[]{_key, days, hours},
  socialLinks[]{_key, platform, url},
  footerBlurb,
  footerVisitHeading,
  footerVisitLinks[]{_key, ${linkFragment}},
  footerHoursHeading,
  footerConnectHeading,
  footerConnectLinks[]{_key, ${linkFragment}},
  legalLine
`

const productFragment = /* groq */ `
  _id, title, "slug": slug.current, price, url, image{${imageFragment}}
`

export const HOMEPAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},

  "home": *[_id == "homePage"][0]{
    heroKicker,
    heroHeadline,
    heroSubtitle,
    heroBadge,
    heroSlides[]{_key, ${imageFragment}},
    heroSlideSeconds,
    trustItems,
    welcomeKicker,
    welcomeHeading,
    welcomeParagraphs,
    welcomeBadge,
    welcomeVideoThumbnail{${imageFragment}},
    welcomeVideoId,
    welcomeVideoTag,
    servicesHeader,
    servicesButton{${linkFragment}},
    shopHeader,
    shopButton{${linkFragment}},
    reviewsHeader,
    reviewsFootnote,
    workHeader,
    galleryImages[]{_key, ${imageFragment}},
    workButton{${linkFragment}},
    mediaHeader,
    mediaTagline,
    locationKicker,
    locationHeading,
    locationSubtitle
  },

  "services": *[_type == "service"] | order(order asc){
    _id, title, description, icon, priceType, price, enquireText, link
  },

  "products": *[_type == "product" && featured == true] | order(order asc){${productFragment}},

  "reviews": *[_type == "review" && featured == true] | order(order asc){
    _id, quote, author, source, rating
  },

  "mediaMentions": *[_type == "mediaMention" && featured == true] | order(order asc){
    _id, badgeBig, badgeSmall, title, excerpt, linkLabel, url
  }
}`)

export const SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{${settingsFragment}}
`)

export const SOCIAL_LINKS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{
    socialLinks[]{_key, platform, url}
  }
`)

export const SEO_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{
    brandName,
    seoTitle,
    seoDescription,
    "ogImage": ogImage.asset->url
  }
`)

export const SERVICES_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "services": *[_type == "service"] | order(order asc){
    _id, title, description, icon, priceType, price, enquireText, link
  }
}`)

export const SHOP_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "products": *[_type == "product"] | order(order asc){${productFragment}}
}`)

export const PRODUCT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && defined(slug.current)]{"slug": slug.current}
`)

export const PRODUCT_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "product": *[_type == "product" && slug.current == $slug][0]{
    ${productFragment},
    description
  }
}`)

export const WORK_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "home": *[_id == "homePage"][0]{
    workHeader,
    galleryImages[]{_key, ${imageFragment}}
  }
}`)

const barberFragment = /* groq */ `
  _id, name, "slug": slug.current, role, bio, photo{${imageFragment}}
`

export const BARBERS_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "barbers": *[_type == "barber"] | order(order asc){${barberFragment}}
}`)

export const BARBER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "barber" && defined(slug.current)]{"slug": slug.current}
`)

export const BARBER_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "barber": *[_type == "barber" && slug.current == $slug][0]{${barberFragment}}
}`)

const guideCardFragment = /* groq */ `
  _id, title, "slug": slug.current, kicker, excerpt, publishedAt
`

export const GUIDES_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "guides": *[_type == "guide"] | order(publishedAt desc){${guideCardFragment}}
}`)

export const GUIDE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "guide" && defined(slug.current)]{"slug": slug.current}
`)

export const GUIDE_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "guide": *[_type == "guide" && slug.current == $slug][0]{
    ${guideCardFragment},
    body[]{
      _key,
      _type,
      text
    }
  }
}`)

export const LOCATION_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_id == "siteSettings"][0]{${settingsFragment}},
  "services": *[_type == "service"] | order(order asc){
    _id, title, description, icon, priceType, price, enquireText, link
  }
}`)
