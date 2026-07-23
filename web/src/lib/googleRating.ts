type GoogleRating = {rating: number | null; count: number | null}

const PLACE_QUERY = 'House Of Barber, 126 Cashel Street, Christchurch Central City, Christchurch 8011'

/**
 * Current star rating from Google Places. Called weekly by
 * /api/cron/update-google-rating, which writes the result into Sanity —
 * the site itself renders the stored value rather than calling Google on
 * every request. Returns nulls when GOOGLE_PLACES_API_KEY isn't set or the
 * request fails; the caller decides how to handle that.
 */
export async function getGoogleRating(): Promise<GoogleRating> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return {rating: null, count: null}

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.rating,places.userRatingCount',
      },
      body: JSON.stringify({textQuery: PLACE_QUERY}),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('[googleRating] Places API responded', res.status, await res.text())
      return {rating: null, count: null}
    }

    const data = await res.json()
    const place = data?.places?.[0]
    return {
      rating: typeof place?.rating === 'number' ? place.rating : null,
      count: typeof place?.userRatingCount === 'number' ? place.userRatingCount : null,
    }
  } catch (error) {
    console.error('[googleRating] fetch failed', error)
    return {rating: null, count: null}
  }
}
