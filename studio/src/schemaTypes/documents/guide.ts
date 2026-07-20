import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  icon: DocumentTextIcon,
  description: 'Grooming advice articles, shown under /guides.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {source: 'title', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Small label above the title, e.g. "Haircuts" or "Beard care".',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Shown on the guides index and used as the search description.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'body',
      title: 'Body',
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
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],

  preview: {
    select: {title: 'title', subtitle: 'kicker'},
  },
})
