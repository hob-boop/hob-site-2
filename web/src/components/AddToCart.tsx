'use client'

import {useState} from 'react'
import {useCart} from './CartProvider'

type Props = {
  slug: string
  title: string
  price: number
  image: string | null
}

export function AddToCart({slug, title, price, image}: Props) {
  const {addItem} = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  return (
    <div className="add-to-cart">
      <div className="qty-stepper">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
        >
          &minus;
        </button>
        <span>{qty}</span>
        <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
          +
        </button>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          addItem({slug, title, price, image}, qty)
          setAdded(true)
          setQty(1)
          window.setTimeout(() => setAdded(false), 1800)
        }}
      >
        {added ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
    </div>
  )
}
