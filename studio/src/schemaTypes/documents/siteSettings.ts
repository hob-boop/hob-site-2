import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Brand', default: true},
    {name: 'nav', title: 'Navigation'},
    {name: 'booking', title: 'Booking & Shop'},
    {name: 'contact', title: 'Contact & Hours'},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
  ],

  fields: [
    // ---------- Brand ----------
    defineField({
      name: 'brandName',
      title: 'Business name',
      type: 'string',
      group: 'brand',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brandTagline',
      title: 'Tagline under the logo',
      description: 'The small gold line in the header, e.g. "EST. 2020 · CHRISTCHURCH".',
      type: 'string',
      group: 'brand',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Sits inside the round emblem in the header and footer. A square, transparent PNG works best.',
      type: 'image',
      options: {hotspot: true},
      group: 'brand',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text helps search engines and screen readers.'),
        }),
      ],
    }),

    // ---------- Navigation ----------
    defineField({
      name: 'navLinks',
      title: 'Header menu',
      description: 'Shown across the top of the page on wider screens.',
      type: 'array',
      group: 'nav',
      of: [defineArrayMember({type: 'link'})],
      validation: (rule) => rule.max(7).warning('More than about six items gets crowded.'),
    }),

    // ---------- Booking & Shop ----------
    defineField({
      name: 'bookingUrl',
      title: 'Booking page',
      description: 'Every "Book Now" button on the site points here.',
      type: 'url',
      group: 'booking',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'bookingLabel',
      title: 'Booking button text',
      type: 'string',
      initialValue: 'Book Now',
      group: 'booking',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cartUrl',
      title: 'Legacy cart link (unused)',
      description:
        'Left over from the old site. The cart icon now always opens the built-in /cart page — this field is no longer used.',
      type: 'url',
      group: 'booking',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),

    // ---------- Contact & Hours ----------
    defineField({
      name: 'phone',
      title: 'Phone number',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email address',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'mapUrl',
      title: '"Find us" map link',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'googleRating',
      title: 'Google rating',
      description:
        'Pulled automatically from Google every Sunday night. You can edit it by hand and it will stick until the next scheduled run.',
      type: 'number',
      group: 'contact',
      validation: (rule) => rule.min(0).max(5),
    }),
    defineField({
      name: 'googleRatingCount',
      title: 'Google review count',
      description: 'Total number of Google reviews, updated alongside the rating.',
      type: 'number',
      group: 'contact',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'googleRatingUpdatedAt',
      title: 'Google rating last synced',
      description: 'Set automatically by the weekly sync job — no need to edit this.',
      type: 'datetime',
      group: 'contact',
      readOnly: true,
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening hours',
      description: 'One line per row, exactly as you want it shown.',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hoursRow',
          fields: [
            defineField({name: 'days', title: 'Days', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'hours', title: 'Hours', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {
            select: {title: 'days', subtitle: 'hours'},
          },
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social buttons',
      description: 'The round buttons floating on the hero image.',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Phone', value: 'phone'},
                  {title: 'Messenger', value: 'messenger'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              description: 'Full web address. For phone, just enter the number.',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        }),
      ],
    }),

    // ---------- Footer ----------
    defineField({
      name: 'footerBlurb',
      title: 'Footer blurb',
      description: 'The short paragraph beside the footer logo.',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    defineField({
      name: 'footerVisitHeading',
      title: '"Visit" column heading',
      type: 'string',
      initialValue: 'VISIT',
      group: 'footer',
    }),
    defineField({
      name: 'footerVisitLinks',
      title: '"Visit" column links',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'footerHoursHeading',
      title: '"Hours" column heading',
      type: 'string',
      initialValue: 'HOURS',
      group: 'footer',
    }),
    defineField({
      name: 'footerConnectHeading',
      title: '"Connect" column heading',
      type: 'string',
      initialValue: 'CONNECT',
      group: 'footer',
    }),
    defineField({
      name: 'footerConnectLinks',
      title: '"Connect" column links',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'legalLine',
      title: 'Copyright line',
      type: 'string',
      group: 'footer',
    }),

    // ---------- SEO ----------
    defineField({
      name: 'seoTitle',
      title: 'Browser tab title',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(65).warning('Long titles get cut off in Google.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.max(160).warning('Google usually cuts off around 160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      description: 'Shown when the site is shared on Facebook, Instagram or in messages.',
      type: 'image',
      options: {hotspot: true},
      group: 'seo',
    }),
  ],

  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
