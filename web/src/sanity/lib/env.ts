/**
 * The Sanity project ID and dataset are public identifiers (they ship in the
 * browser bundle either way), so they default here to keep deploys
 * zero-config. Set the env vars to point at a different project or dataset.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'z4yj6bjg'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-01'
