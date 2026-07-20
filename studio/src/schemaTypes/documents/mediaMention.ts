import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons'

export const mediaMention = defineType({
  name: 'mediaMention',
  title: 'Media Mention',
  type: 'document',
  icon: BookIcon,
  description: 'Press, awards and rankings shown in the "In the Media" section.',
  fields: [
    defineField({
      name: 'badgeBig',
      title: 'Badge — large text',
      description: 'The big text inside the gold circle, e.g. "#1".',
      type: 'string',
      validation: (rule) => rule.required().max(4).warning('Two or three characters fit best in the circle.'),
    }),
    defineField({
      name: 'badgeSmall',
      title: 'Badge — small text',
      description: 'The small text under it, e.g. "2022–2023".',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link text',
      type: 'string',
      initialValue: 'Read more →',
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
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
    select: {title: 'title', badgeBig: 'badgeBig', badgeSmall: 'badgeSmall', order: 'order'},
    prepare({title, badgeBig, badgeSmall, order}) {
      return {title: `${order}. ${title}`, subtitle: [badgeBig, badgeSmall].filter(Boolean).join(' · ')}
    },
  },
})
