import type {StructureResolver} from 'sanity/structure'
import {CogIcon, HomeIcon, SparklesIcon, BasketIcon, StarIcon, BookIcon} from '@sanity/icons'

/**
 * Documents that must only ever exist once. They're pinned to a fixed
 * document ID here and filtered out of the generic lists below so they
 * can't be duplicated by accident.
 */
const SINGLETONS = ['siteSettings', 'homePage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('House of Barber')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Homepage')),

      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),

      S.divider(),

      S.documentTypeListItem('service')
        .title('Services')
        .icon(SparklesIcon)
        .child(S.documentTypeList('service').title('Services').defaultOrdering([{field: 'order', direction: 'asc'}])),

      S.documentTypeListItem('product')
        .title('Products')
        .icon(BasketIcon)
        .child(S.documentTypeList('product').title('Products').defaultOrdering([{field: 'order', direction: 'asc'}])),

      S.documentTypeListItem('review')
        .title('Reviews')
        .icon(StarIcon)
        .child(S.documentTypeList('review').title('Reviews').defaultOrdering([{field: 'order', direction: 'asc'}])),

      S.documentTypeListItem('mediaMention')
        .title('Media Mentions')
        .icon(BookIcon)
        .child(
          S.documentTypeList('mediaMention')
            .title('Media Mentions')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return (
          id &&
          !SINGLETONS.includes(id) &&
          !['service', 'product', 'review', 'mediaMention'].includes(id)
        )
      }),
    ])
