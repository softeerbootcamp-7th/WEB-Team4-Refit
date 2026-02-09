import { defineConfig } from 'orval'

export default defineConfig({
  'refit-api': {
    input: './api-docs.json',
    output: {
      workspace: './src/api',
      target: './refit-api.ts',
      mode: 'tags-split',
      httpClient: 'fetch',
      client: 'react-query',
      prettier: true,
    },
  },
})
