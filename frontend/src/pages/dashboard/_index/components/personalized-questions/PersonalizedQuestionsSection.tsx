import DifficultQuestionsSection from '@/pages/dashboard/_index/components/difficult-questions/DifficultQuestionsSection'
import FrequentlyAskedSection from '@/pages/dashboard/_index/components/frequent-questions/FrequentQuestionsSection'
import SectionHeader from '@/pages/dashboard/_index/components/SectionHeader'
import Top10QuestionsSection from '@/pages/dashboard/_index/components/top10-questions/Top10QuestionsSection'

export default function PersonalizedQuestionsSection() {
  return (
    <div className="flex flex-col gap-3">
      <SectionHeader title="정윤님을 위한 맞춤 면접질문" showNavArrows={false} />
      <div className="grid grid-cols-2 items-stretch gap-3">
        <FrequentlyAskedSection />
        <DifficultQuestionsSection />
      </div>
      <Top10QuestionsSection />
    </div>
  )
}
