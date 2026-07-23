import type {SchemaTypeDefinition} from 'sanity'

import {link} from './objects/link'
import {sectionHeader} from './objects/sectionHeader'

import {siteSettings} from './documents/siteSettings'
import {homePage} from './documents/homePage'
import {service} from './documents/service'
import {product} from './documents/product'
import {review} from './documents/review'
import {mediaMention} from './documents/mediaMention'
import {barber} from './documents/barber'
import {guide} from './documents/guide'
import {reservation} from './documents/reservation'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  link,
  sectionHeader,
  // Singletons
  siteSettings,
  homePage,
  // Collections
  service,
  product,
  review,
  mediaMention,
  barber,
  guide,
  reservation,
]
