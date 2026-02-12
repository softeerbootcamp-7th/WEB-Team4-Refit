import { defineConfig } from 'orval'

export default defineConfig({
  'refit-api': {
    input: './api-docs.json',
    output: {
      client: 'react-query',
      workspace: './src/apis',
      target: './generated/refit-api.ts',
      mode: 'tags-split',
      httpClient: 'fetch',
      prettier: true,
      mock: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          useSuspenseQuery: true,
        },
        mutator: {
          path: './custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
})
