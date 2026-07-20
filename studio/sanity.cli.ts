import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'z4yj6bjg',
    dataset: 'production',
  },
  deployment: {
    // Standalone Studios pick up Sanity bugfixes and features without a redeploy.
    autoUpdates: true,
  },
})
