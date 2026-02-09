import { PdfSection } from '@/features/record/link/components/pdf-section'
import { QnaListSection } from '@/features/record/link/components/qna-section/QnaListSection'
import { RecordLinkSidebar } from '@/features/record/link/components/sidebar/Sidebar'
import { HighlightProvider } from '@/features/record/link/contexts'

export default function RecordLinkPage() {
  return (
    <HighlightProvider>
      <RecordLinkContent />
    </HighlightProvider>
  )
}

function RecordLinkContent() {
  return (
    <>
      <div className="grid h-full grid-cols-[80px_1.2fr_1fr]">
        <RecordLinkSidebar />
        <div className="flex h-full flex-col gap-5 overflow-y-auto py-6 pl-6">
          <h1 className="title-xl-bold">면접에서 나온 질문과 자기소개서를 연결해보세요.</h1>
          <QnaListSection />
        </div>
        <PdfSection />
      </div>
    </>
  )
}
