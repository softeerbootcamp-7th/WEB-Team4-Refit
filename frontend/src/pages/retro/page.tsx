import { useState } from 'react'
import { RetroPdfPanel } from '@/features/retro/_index/components/pdf-panel/RetroPdfPanel'
import { RetroSection } from '@/features/retro/_index/components/retro-section/RetroSection'
import { RetroMinimizedSidebar, RetroSidebar } from '@/features/retro/_index/components/sidebar'
import { RetroProvider } from '@/features/retro/_index/contexts'
import { MOCK_RETRO_LIST } from '@/features/retro/_index/example'

export default function RetroQuestionPage() {
  // TODO: API fetch로 교체
  const retroList = MOCK_RETRO_LIST

  return (
    <RetroProvider retroList={retroList}>
      <RetroLayout />
    </RetroProvider>
  )
}

function RetroLayout() {
  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const togglePdf = () => setIsPdfOpen((v) => !v)

  if (!isPdfOpen) {
    return (
      <div className="grid h-full grid-cols-[320px_1fr]">
        <RetroSidebar />
        <RetroSection isPdfOpen={isPdfOpen} togglePdf={togglePdf} />
      </div>
    )
  }
  return (
    <div className="grid h-full grid-cols-[80px_1fr_1fr]">
      <RetroMinimizedSidebar />
      <RetroSection isPdfOpen={isPdfOpen} togglePdf={togglePdf} />
      <RetroPdfPanel />
    </div>
  )
}
