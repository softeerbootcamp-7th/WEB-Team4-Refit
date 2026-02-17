import DifficultQuestionsSection from '@/features/dashboard/_index/components/difficult-questions/DifficultQuestionsSection'
import FrequentlyAskedSection from '@/features/dashboard/_index/components/frequent-questions/FrequentQuestionsSection'
import PopularQuestionsSection from '@/features/dashboard/_index/components/popular-questions/PopularQuestionsSection'
import SectionHeader from '@/features/dashboard/_index/components/SectionHeader'

export default function PersonalizedQuestionsSection() {
  return (
    <div className="flex flex-col gap-3">
      <SectionHeader title="정윤님을 위한 맞춤 면접질문" showNavArrows={false} />
      <div className="grid grid-cols-[4.5fr_5.5fr] items-stretch gap-3">
        <FrequentlyAskedSection />
        <DifficultQuestionsSection />
      </div>
      <PopularQuestionsSection />
    </div>
  )
}
