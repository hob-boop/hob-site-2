import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const barber = defineType({
  name: 'barber',
  title: 'Barber',
  type: 'document',
  icon: UserIcon,
  description: 'One page per barber, so their name can be found and booked directly.',
  fields: [
    defineField({
      name: 'name',
      title: 'First name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {source: 'name', maxLength: 40},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'Barber',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      description: 'A couple of sentences — specialty, style, what makes them, them.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
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
    select: {title: 'name', subtitle: 'role', media: 'photo', order: 'order'},
    prepare({title, subtitle, media, order}) {
      return {title: `${order}. ${title}`, subtitle, media}
    },
  },
})
