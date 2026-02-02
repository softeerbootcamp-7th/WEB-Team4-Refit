import Button from '@/shared/Button'
import { QnaListSection } from './QnaListSection'

export function RecordSection() {
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <h1 className="title-xl-bold">작성 내용을 확인해주세요.</h1>
      <QnaListSection />
      <div className="flex shrink-0 justify-end gap-3">
        <Button variant="outline-gray-100" size="lg" className="w-35">
          뒤로 가기
        </Button>
        <Button variant="fill-orange-500" size="lg" className="w-60">
          다음 단계
        </Button>
      </div>
    </div>
  )
}
