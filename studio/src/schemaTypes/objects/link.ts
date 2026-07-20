import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/**
 * One link. The `kind` toggle swaps which field you fill in, so
 * editors never have to hand-write "tel:" or "mailto:" prefixes.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Link type',
      type: 'string',
      initialValue: 'external',
      options: {
        list: [
          {title: 'Web address', value: 'external'},
          {title: 'Section on this page', value: 'anchor'},
          {title: 'Page on this site', value: 'page'},
          {title: 'Phone number', value: 'phone'},
          {title: 'Email address', value: 'email'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Web address',
      type: 'url',
      hidden: ({parent}) => parent?.kind !== 'external',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).custom((value, context) => {
          const parent = context.parent as {kind?: string} | undefined
          if (parent?.kind === 'external' && !value) return 'Add a web address'
          return true
        }),
    }),
    defineField({
      name: 'anchor',
      title: 'Section',
      description: 'Jumps to a section further down the homepage.',
      type: 'string',
      options: {
        list: [
          {title: 'Top of page', value: 'top'},
          {title: 'The House', value: 'welcome'},
          {title: 'Services', value: 'services'},
          {title: 'Shop', value: 'shop'},
          {title: 'Reviews', value: 'reviews'},
          {title: 'Location / Footer', value: 'location'},
        ],
      },
      hidden: ({parent}) => parent?.kind !== 'anchor',
    }),
    defineField({
      name: 'internalPage',
      title: 'Page',
      description: 'Links to one of the standalone pages built out on the new site.',
      type: 'string',
      options: {
        list: [
          {title: 'Services', value: 'services'},
          {title: 'Shop', value: 'shop'},
          {title: 'Our Work', value: 'work'},
        ],
      },
      hidden: ({parent}) => parent?.kind !== 'page',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {kind?: string} | undefined
          if (parent?.kind === 'page' && !value) return 'Choose a page'
          return true
        }),
    }),
    defineField({
      name: 'phone',
      title: 'Phone number',
      description: 'As you want it shown, e.g. 03 390 0106.',
      type: 'string',
      hidden: ({parent}) => parent?.kind !== 'phone',
    }),
    defineField({
      name: 'email',
      title: 'Email address',
      type: 'string',
      hidden: ({parent}) => parent?.kind !== 'email',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.kind !== 'external',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      kind: 'kind',
      url: 'url',
      anchor: 'anchor',
      internalPage: 'internalPage',
      phone: 'phone',
      email: 'email',
    },
    prepare({title, kind, url, anchor, internalPage, phone, email}) {
      const target =
        kind === 'anchor'
          ? `#${anchor ?? ''}`
          : kind === 'page'
            ? `/${internalPage ?? ''}`
            : kind === 'phone'
              ? phone
              : kind === 'email'
                ? email
                : url
      return {title: title || 'Untitled link', subtitle: target || 'No destination set'}
    },
  },
})
