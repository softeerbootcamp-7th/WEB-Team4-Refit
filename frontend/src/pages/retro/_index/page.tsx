import { RetroPdfPanel } from './components/pdf-panel/RetroPdfPanel'
import { RetroSection } from './components/retro-section/RetroSection'
import { RetroMinimizedSidebar, RetroSidebar } from './components/sidebar'
import { RetroProvider, useRetroContext } from './contexts'

export default function RetroQuestionPage() {
  return (
    <RetroProvider>
      <RetroLayout />
    </RetroProvider>
  )
}

function RetroLayout() {
  const { isPdfOpen } = useRetroContext()

  if (!isPdfOpen) {
    return (
      <div className="grid h-full grid-cols-[320px_1fr]">
        <RetroSidebar />
        <RetroSection />
      </div>
    )
  }
  return (
    <div className="grid h-full grid-cols-[80px_1fr_1fr]">
      <RetroMinimizedSidebar />
      <RetroSection />
      <RetroPdfPanel />
    </div>
  )
}
