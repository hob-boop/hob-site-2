import {NextResponse} from 'next/server'
import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '@/sanity/lib/env'

export const dynamic = 'force-dynamic'

type ReservationItem = {
  slug: string
  title: string
  price: number
  qty: number
}

type ReservationBody = {
  name: string
  phone: string
  email?: string
  notes?: string
  items: ReservationItem[]
}

function isValidItem(item: unknown): item is ReservationItem {
  if (!item || typeof item !== 'object') return false
  const i = item as Record<string, unknown>
  return (
    typeof i.slug === 'string' &&
    typeof i.title === 'string' &&
    typeof i.price === 'number' &&
    i.price >= 0 &&
    typeof i.qty === 'number' &&
    i.qty > 0
  )
}

export async function POST(request: Request) {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    return NextResponse.json(
      {error: 'Reservations are not configured yet. Please call or message us directly to reserve products.'},
      {status: 503},
    )
  }

  let body: ReservationBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const name = body.name?.trim()
  const phone = body.phone?.trim()
  const email = body.email?.trim()
  const notes = body.notes?.trim()
  const items = Array.isArray(body.items) ? body.items.filter(isValidItem) : []

  if (!name) return NextResponse.json({error: 'Your name is required.'}, {status: 400})
  if (!phone) return NextResponse.json({error: 'A phone number is required.'}, {status: 400})
  if (!items.length) return NextResponse.json({error: 'Your cart is empty.'}, {status: 400})

  // Recompute the total server-side rather than trusting whatever the client sent.
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

  try {
    const doc = await client.create({
      _type: 'reservation',
      status: 'new',
      customerName: name,
      phone,
      ...(email ? {email} : {}),
      ...(notes ? {notes} : {}),
      items: items.map((item) => ({
        _type: 'reservedItem',
        _key: item.slug,
        productTitle: item.title,
        quantity: item.qty,
        price: item.price,
      })),
      total,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ok: true, id: doc._id})
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[reservations] failed to create document:', message)
    return NextResponse.json({error: 'Something went wrong submitting your reservation. Please try again.'}, {status: 500})
  }
}
