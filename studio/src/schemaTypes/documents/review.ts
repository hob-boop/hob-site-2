import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'What they said',
      description: 'Don\u2019t add quote marks — they\u2019re added for you.',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Who said it',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Where it came from',
      type: 'string',
      initialValue: 'Google Review',
    }),
    defineField({
      name: 'rating',
      title: 'Stars',
      type: 'number',
      initialValue: 5,
      options: {
        list: [
          {title: '★★★★★', value: 5},
          {title: '★★★★', value: 4},
          {title: '★★★', value: 3},
          {title: '★★', value: 2},
          {title: '★', value: 1},
        ],
      },
      validation: (rule) => rule.required().min(1).max(5),
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
    select: {title: 'author', quote: 'quote', rating: 'rating', featured: 'featured', order: 'order'},
    prepare({title, quote, rating, featured, order}) {
      return {
        title: `${order}. ${title}`,
        subtitle: `${'\u2605'.repeat(rating ?? 5)}${featured ? '' : ' · hidden'} — ${quote?.slice(0, 50) ?? ''}…`,
      }
    },
  },
})
