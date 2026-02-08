import { useState } from 'react'
import { INTERVIEW_TYPE_LABEL } from '@/shared/constants/interviews'
import { useSectionScroll } from '@/shared/hooks/useSectionScroll'
import { DetailHeader } from './components/contents/DetailHeader'
import { RetroDetailSection } from './components/contents/RetroDetailSection'
import { DetailMinimizedSidebar } from './components/sidebar/DetailMinimizedSidebar'
import { DetailSidebar } from './components/sidebar/DetailSidebar'
import { MOCK_INTERVIEW_DETAIL } from './example'

export default function RetroDetailPage() {
  const interviewDetail = MOCK_INTERVIEW_DETAIL
  const { company, jobRole, interviewType, qnaSets } = interviewDetail
  const interviewTypeLabel = INTERVIEW_TYPE_LABEL[interviewType]

  const [isPdfOpen, setIsPdfOpen] = useState(false)

  const totalSectionCount = qnaSets.length + 1
  const { activeIndex, setRef, scrollContainerRef, handleItemClick } = useSectionScroll({
    sectionCount: totalSectionCount,
  })

  const togglePdf = () => setIsPdfOpen((v) => !v)

  const title = `${company} ${jobRole} ${interviewTypeLabel} 회고 상세 보기`

  if (isPdfOpen) {
    return (
      <div className="grid h-full grid-cols-[80px_1fr_1fr]">
        <DetailMinimizedSidebar qnaSets={qnaSets} activeIndex={activeIndex} onItemClick={handleItemClick} />
        <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
          <DetailHeader title={title} isPdfOpen={isPdfOpen} onTogglePdf={togglePdf} />
          <RetroDetailSection qnaSets={qnaSets} setRef={setRef} scrollContainerRef={scrollContainerRef} />
        </div>
        <div className="flex h-full flex-col bg-gray-100">PDF 영역</div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
      <DetailSidebar qnaSets={qnaSets} activeIndex={activeIndex} onItemClick={handleItemClick} />
      <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
        <DetailHeader title={title} isPdfOpen={isPdfOpen} onTogglePdf={togglePdf} />
        <RetroDetailSection qnaSets={qnaSets} setRef={setRef} scrollContainerRef={scrollContainerRef} />
      </div>
    </div>
  )
}
