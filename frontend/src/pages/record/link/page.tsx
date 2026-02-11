import { PdfSection } from '@/features/record/link/components/pdf-section'
import { QnaListSection } from '@/features/record/link/components/qna-section/QnaListSection'
import { RecordLinkSidebar } from '@/features/record/link/components/sidebar/Sidebar'
import { HighlightProvider } from '@/features/record/link/contexts'
import { MOCK_QNA_SET_LIST } from '@/shared/constants/example'
import { useSectionScroll } from '@/shared/hooks/useSectionScroll'

export default function RecordLinkPage() {
  return (
    <HighlightProvider>
      <RecordLinkContent />
    </HighlightProvider>
  )
}

function RecordLinkContent() {
  // TODO: API 연동 시 실제 데이터로 교체
  const qnaList = MOCK_QNA_SET_LIST

  const { activeIndex, setRef, scrollContainerRef, handleItemClick } = useSectionScroll({
    idPrefix: 'record-link',
  })

  const sidebarItems = qnaList.map(({ qnaSetId }, index) => ({
    id: qnaSetId,
    label: `${index + 1}번`,
  }))

  return (
    <div className="grid h-full grid-cols-[80px_1.2fr_1fr]">
      <RecordLinkSidebar items={sidebarItems} activeIndex={activeIndex} onItemClick={handleItemClick} />
      <div className="flex h-full flex-col gap-5 overflow-hidden py-6 pl-6">
        <h1 className="title-l-bold">면접에서 나온 질문과 자기소개서를 연결해보세요.</h1>
        <QnaListSection qnaList={qnaList} setRef={setRef} scrollContainerRef={scrollContainerRef} />
      </div>
      <PdfSection />
    </div>
  )
}
