import {defineArrayMember, defineField, defineType} from 'sanity'
import {InboxIcon} from '@sanity/icons'

/**
 * Created by the website's cart when a customer reserves products online.
 * Payment always happens in store — this just captures who to expect and
 * what to hold aside for them. Submitted by the /api/reservations route,
 * not editable by hand beyond updating the status.
 */
export const reservation = defineType({
  name: 'reservation',
  title: 'Shop Reservations',
  type: 'document',
  icon: InboxIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Completed', value: 'completed'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone number',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email address',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes from customer',
      description: 'E.g. a preferred pickup time.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'items',
      title: 'Items reserved',
      description: 'A snapshot taken at the time of reservation, so later price or catalogue changes don\'t affect it.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reservedItem',
          fields: [
            defineField({name: 'productTitle', title: 'Product', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'quantity', title: 'Quantity', type: 'number', validation: (r) => r.required().min(1)}),
            defineField({name: 'price', title: 'Price (each)', type: 'number', validation: (r) => r.required().min(0)}),
          ],
          preview: {
            select: {title: 'productTitle', quantity: 'quantity', price: 'price'},
            prepare({title, quantity, price}) {
              return {title, subtitle: `${quantity} × $${price}`}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'createdAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
  ],

  preview: {
    select: {title: 'customerName', total: 'total', status: 'status'},
    prepare({title, total, status}) {
      return {
        title: title ?? 'Unnamed reservation',
        subtitle: `$${total ?? 0} · ${status ?? 'new'}`,
      }
    },
  },
})
