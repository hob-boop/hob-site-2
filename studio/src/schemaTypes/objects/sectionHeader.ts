import {defineField, defineType} from 'sanity'

/**
 * Every section on the page shares the same header anatomy:
 * a small uppercase kicker, a big heading, a gold rule, and an
 * optional intro line. Reused so editors learn it once.
 */
export const sectionHeader = defineType({
  name: 'sectionHeader',
  title: 'Section Header',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Small spaced-out label above the heading, e.g. "What we do".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro line',
      description: 'Optional sentence under the gold rule.',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'kicker'},
  },
})
