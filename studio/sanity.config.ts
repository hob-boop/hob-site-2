import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'

const SINGLETONS = ['siteSettings', 'homePage']

export default defineConfig({
  name: 'default',
  title: 'House of Barber',

  projectId: 'z4yj6bjg',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Keep singletons out of the global "create new" menu.
    templates: (prev) => prev.filter((template) => !SINGLETONS.includes(template.schemaType)),
  },

  document: {
    // Singletons can be edited and published, but never duplicated or deleted.
    actions: (prev, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(({action}) => action !== 'duplicate' && action !== 'delete' && action !== 'unpublish')
        : prev,
  },
})
