import {defineArrayMember, defineField, defineType} from 'sanity'
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
      name: 'slug',
      title: 'Article page URL',
      description:
        'Generates the address of the full article on this site, e.g. /media/top-1-barbershop-christchurch. Leave the body empty and this off if the card should just show the excerpt with no full article.',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary',
      description: 'Shown on the card, and as the article page\'s intro/search description.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'body',
      title: 'Full article',
      description: 'The full article, shown on this site\'s own page instead of linking out.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'paragraph',
          title: 'Paragraph',
          fields: [defineField({name: 'text', title: 'Text', type: 'text', rows: 4})],
          preview: {select: {title: 'text'}},
        }),
        defineArrayMember({
          type: 'object',
          name: 'subheading',
          title: 'Subheading',
          fields: [defineField({name: 'text', title: 'Text', type: 'string'})],
          preview: {
            select: {title: 'text'},
            prepare: ({title}) => ({title: `— ${title}`}),
          },
        }),
      ],
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link text',
      type: 'string',
      initialValue: 'Read more →',
    }),
    defineField({
      name: 'url',
      title: 'External link (only used if no article page above)',
      description: 'Falls back to this if the article page URL above is empty.',
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
