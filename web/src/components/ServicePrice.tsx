import type {Service} from '@/sanity/lib/types'

/** Formats a service price the way the original design did. */
export function ServicePrice({service}: {service: Service}) {
  if (service.priceType === 'enquire') {
    return <small>{service.enquireText ?? 'enquire in-shop'}</small>
  }
  const prefix = service.priceType === 'from' ? 'from ' : ''
  return <>{`${prefix}$${service.price ?? 0}`}</>
}
