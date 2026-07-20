import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'z4yj6bjg',
    dataset: 'production',
  },
  deployment: {
    // Standalone Studios pick up Sanity bugfixes and features without a redeploy.
    autoUpdates: true,
    appId: 'q90z13fh1e42vuk60jx0wh3u',
  },
})
