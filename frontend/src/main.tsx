import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import Router from '@/routes/index.tsx'
import '@/styles/index.css'

const queryClient = new QueryClient()

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') return
  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </StrictMode>,
  )
})
