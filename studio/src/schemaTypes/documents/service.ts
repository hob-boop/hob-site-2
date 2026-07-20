import {defineField, defineType} from 'sanity'
import {SparklesIcon} from '@sanity/icons'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Service name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      description: 'One line. Keep it punchy — the cards are narrow.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(90).warning('Long descriptions make the cards uneven.'),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      initialValue: 'scissors',
      options: {
        list: [
          {title: '✂ Scissors', value: 'scissors'},
          {title: '▭ Clippers', value: 'clippers'},
          {title: '◗ Razor', value: 'razor'},
          {title: '✲ Spa / Wellness', value: 'spa'},
          {title: '⌁ Beard', value: 'beard'},
          {title: '★ Star', value: 'star'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceType',
      title: 'How is this priced?',
      type: 'string',
      initialValue: 'fixed',
      options: {
        list: [
          {title: 'Fixed price', value: 'fixed'},
          {title: 'Starting from', value: 'from'},
          {title: 'Enquire in-shop', value: 'enquire'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      description: 'Numbers only — the dollar sign is added for you.',
      type: 'number',
      hidden: ({parent}) => parent?.priceType === 'enquire',
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          const parent = context.parent as {priceType?: string} | undefined
          if (parent?.priceType !== 'enquire' && (value === undefined || value === null)) {
            return 'Add a price, or switch this to "Enquire in-shop".'
          }
          return true
        }),
    }),
    defineField({
      name: 'enquireText',
      title: 'Text instead of a price',
      type: 'string',
      initialValue: 'enquire in-shop',
      hidden: ({parent}) => parent?.priceType !== 'enquire',
    }),
    defineField({
      name: 'link',
      title: 'Where the card links to',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
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
    select: {title: 'title', priceType: 'priceType', price: 'price', order: 'order'},
    prepare({title, priceType, price, order}) {
      const shown =
        priceType === 'enquire' ? 'Enquire in-shop' : priceType === 'from' ? `from $${price}` : `$${price}`
      return {title: `${order}. ${title}`, subtitle: shown}
    },
  },
})
