import {defineField, defineType} from 'sanity'
import {BasketIcon} from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BasketIcon,
  description: 'Products shown on the homepage. Clicking one opens the product page on the shop.',
  fields: [
    defineField({
      name: 'title',
      title: 'Product name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product photo',
      description: 'Square photos look best — the card crops to a square.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text helps search engines and screen readers.'),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      description: 'Numbers only — the dollar sign is added for you.',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'url',
      title: 'Product page',
      description: 'The page on the shop where this product can be bought.',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'featured',
      title: 'Show on the homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Position',
      description: 'Lower numbers appear first.',
      type: 'number',
      initialValue: 1,
      validation: (rule) => rule.required().min(1),
    }),
  ],

  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],

  preview: {
    select: {title: 'title', price: 'price', media: 'image', featured: 'featured', order: 'order'},
    prepare({title, price, media, featured, order}) {
      return {
        title: `${order}. ${title}`,
        subtitle: `$${price}${featured ? '' : ' · hidden from homepage'}`,
        media,
      }
    },
  },
})
