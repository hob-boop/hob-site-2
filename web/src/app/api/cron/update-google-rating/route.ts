import {NextResponse} from 'next/server'
import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '@/sanity/lib/env'
import {getGoogleRating} from '@/lib/googleRating'

export const dynamic = 'force-dynamic'

/**
 * Runs weekly (see vercel.json: Sunday 11:59pm NZT) to pull the current
 * rating from Google Places and store it on siteSettings, so the homepage
 * can render it without hitting Google on every request.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
  }

  const writeToken = process.env.SANITY_WRITE_TOKEN
  if (!writeToken) {
    return NextResponse.json({error: 'SANITY_WRITE_TOKEN is not configured.'}, {status: 503})
  }

  const {rating, count} = await getGoogleRating()
  if (rating == null) {
    return NextResponse.json({error: 'Could not fetch a rating from Google Places.'}, {status: 502})
  }

  const client = createClient({projectId, dataset, apiVersion, token: writeToken, useCdn: false})

  await client
    .patch('siteSettings')
    .set({
      googleRating: rating,
      googleRatingCount: count,
      googleRatingUpdatedAt: new Date().toISOString(),
    })
    .commit()

  return NextResponse.json({ok: true, rating, count})
}
