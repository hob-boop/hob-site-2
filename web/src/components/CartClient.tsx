'use client'

import {useState} from 'react'
import Image from 'next/image'
import {useCart} from './CartProvider'

type Status = 'idle' | 'submitting' | 'done' | 'error'

export function CartClient() {
  const {items, subtotal, updateQty, removeItem, clear} = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          notes: notes || undefined,
          items: items.map((i) => ({slug: i.slug, title: i.title, price: i.price, qty: i.qty})),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Something went wrong. Please try again.')

      setStatus('done')
      clear()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="cart-done">
        <h2>Reservation received</h2>
        <p>
          Thanks, {name}! We&apos;ve set your items aside. We&apos;ll be in touch on {phone} to confirm — pay by
          card or cash when you pick up.
        </p>
        <a className="btn btn-ghost-dark" href="/shop">
          Continue shopping
        </a>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty.</p>
        <a className="btn btn-primary" href="/shop">
          Browse the shop
        </a>
      </div>
    )
  }

  return (
    <div className="cart-grid">
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.slug}>
            <div className="cart-row-img">
              {item.image ? <Image src={item.image} alt={item.title} width={80} height={80} /> : null}
            </div>
            <div className="cart-row-info">
              <a href={`/shop/${item.slug}`}>{item.title}</a>
              <span className="cart-row-price">${item.price}</span>
            </div>
            <div className="qty-stepper">
              <button
                type="button"
                onClick={() => updateQty(item.slug, item.qty - 1)}
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span>{item.qty}</span>
              <button
                type="button"
                onClick={() => updateQty(item.slug, item.qty + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="cart-row-total">${(item.price * item.qty).toFixed(2)}</div>
            <button
              type="button"
              className="cart-row-remove"
              onClick={() => removeItem(item.slug)}
              aria-label={`Remove ${item.title}`}
            >
              &times;
            </button>
          </div>
        ))}

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>Total (pay in store)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form className="cart-form" onSubmit={submit}>
        <h3>Reserve your items</h3>
        <p className="cart-form-note">
          No payment is taken on this website — you&apos;ll pay by card or cash in store when you pick up.
        </p>

        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Phone
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          Email (optional)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Notes (optional)
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        {error ? <p className="cart-form-error">{error}</p> : null}

        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Reserve — Pay in Store'}
        </button>
      </form>
    </div>
  )
}
