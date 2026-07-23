import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'trust', title: 'Trust Strip'},
    {name: 'welcome', title: 'The House'},
    {name: 'services', title: 'Services'},
    {name: 'shop', title: 'Shop'},
    {name: 'reviews', title: 'Reviews'},
    {name: 'work', title: 'Our Work'},
    {name: 'media', title: 'In the Media'},
    {name: 'location', title: 'Find Us'},
  ],

  fields: [
    // ---------- Hero ----------
    defineField({
      name: 'heroKicker',
      title: 'Kicker',
      description: 'Small gold label above the headline.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      description: 'Press Enter for a line break. Shown in very large type.',
      type: 'text',
      rows: 2,
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroBadge',
      title: 'Badge text',
      description: 'The pill-shaped outline badge under the subtitle.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSlides',
      title: 'Background slideshow',
      description:
        'These fade from one to the next automatically. Two or more images gives you a slideshow; one image stays still.',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).error('The hero needs at least one background image.'),
    }),
    defineField({
      name: 'heroSlideSeconds',
      title: 'Seconds per slide',
      type: 'number',
      initialValue: 4.5,
      group: 'hero',
      validation: (rule) => rule.min(2).max(20),
    }),

    // ---------- Trust strip ----------
    defineField({
      name: 'trustItems',
      title: 'Gold strip items',
      description: 'The short claims in the gold band under the hero.',
      type: 'array',
      group: 'trust',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(5).warning('More than about four wraps awkwardly on mobile.'),
    }),

    // ---------- Welcome / The House ----------
    defineField({
      name: 'welcomeKicker',
      title: 'Kicker',
      type: 'string',
      group: 'welcome',
    }),
    defineField({
      name: 'welcomeHeading',
      title: 'Heading',
      type: 'string',
      group: 'welcome',
    }),
    defineField({
      name: 'welcomeParagraphs',
      title: 'Paragraphs',
      type: 'array',
      group: 'welcome',
      of: [defineArrayMember({type: 'text', rows: 4})],
    }),
    defineField({
      name: 'welcomeBadge',
      title: 'Badge text',
      type: 'string',
      group: 'welcome',
    }),
    defineField({
      name: 'welcomeVideoThumbnail',
      title: 'Video thumbnail',
      description: 'The still image shown before someone presses play.',
      type: 'image',
      options: {hotspot: true},
      group: 'welcome',
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
    }),
    defineField({
      name: 'welcomeVideoId',
      title: 'YouTube video ID',
      description:
        'Just the ID, not the whole address. In youtube.com/watch?v=JNMEBPJRPKk the ID is JNMEBPJRPKk.',
      type: 'string',
      group: 'welcome',
    }),
    defineField({
      name: 'welcomeVideoTag',
      title: 'Caption over the video',
      type: 'string',
      group: 'welcome',
    }),

    // ---------- Section headers ----------
    defineField({
      name: 'servicesHeader',
      title: 'Services section header',
      type: 'sectionHeader',
      group: 'services',
    }),
    defineField({
      name: 'servicesButton',
      title: 'Button under the services',
      type: 'link',
      group: 'services',
    }),

    defineField({
      name: 'shopHeader',
      title: 'Shop section header',
      type: 'sectionHeader',
      group: 'shop',
    }),
    defineField({
      name: 'shopButton',
      title: 'Button under the products',
      type: 'link',
      group: 'shop',
    }),

    defineField({
      name: 'reviewsHeader',
      title: 'Reviews section header',
      type: 'sectionHeader',
      group: 'reviews',
    }),
    defineField({
      name: 'reviewsFootnote',
      title: 'Line under the reviews',
      description: 'Wrap the part you want in gold with **double asterisks**.',
      type: 'string',
      group: 'reviews',
    }),

    defineField({
      name: 'workHeader',
      title: 'Our Work section header',
      type: 'sectionHeader',
      group: 'work',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery photos',
      description:
        'The sideways-scrolling strip of cuts. Drag to reorder. Portrait photos look best — each one crops to a tall 3:4 frame.',
      type: 'array',
      group: 'work',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'workButton',
      title: 'Button under the gallery',
      type: 'link',
      group: 'work',
    }),

    defineField({
      name: 'mediaHeader',
      title: 'In the Media section header',
      type: 'sectionHeader',
      group: 'media',
    }),
    defineField({
      name: 'mediaTagline',
      title: 'Italic gold tagline',
      type: 'text',
      rows: 2,
      group: 'media',
    }),

    // ---------- Find Us (map) ----------
    defineField({
      name: 'locationKicker',
      title: 'Kicker',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'locationHeading',
      title: 'Heading',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'locationSubtitle',
      title: 'Address line',
      description: 'Shown under the heading, above the map.',
      type: 'string',
      group: 'location',
    }),
  ],

  preview: {
    prepare: () => ({title: 'Homepage'}),
  },
})
