import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { shouldRetryApiQuery } from '@/features/_common/utils/queryRetry'
import Router from '@/routes/index.tsx'
import '@/styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryApiQuery,
    },
  },
})

/** Mock API 연결을 위한 로직 */
// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') return
//   const { worker } = await import('@/mocks/browser')
//   return worker.start({ onUnhandledRequest: 'bypass' })
// }

// enableMocking().then(() => {
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Router />
  </QueryClientProvider>,
)
// })
