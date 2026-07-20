import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'cdn.sanity.io'},
      // Kept so the site still renders while photos are migrated
      // off the old host and into Sanity.
      {protocol: 'https', hostname: 'houseofbarbernz.co.nz'},
    ],
  },
}

export default nextConfig
