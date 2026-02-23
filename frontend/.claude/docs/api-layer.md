# API Layer (`src/apis/`)

Orval generates React Query hooks from `api-docs.json` (fetched from the backend) into `src/apis/generated/`, split by tag. All generated hooks are re-exported from `src/apis/index.ts`.

The custom fetch client (`src/apis/custom-fetch.ts`):

- Prepends `VITE_API_BASE_URL` to all requests
- Sends cookies (`credentials: 'include'`)
- On `TOKEN_REISSUE_REQUIRED` error codes, automatically calls `/auth/reissue` once (with in-flight deduplication) and retries
To regenerate after backend API changes: `pnpm orval`
