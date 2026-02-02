import Badge from '@/shared/components/badge'

/** 컴포넌트 테스트용 페이지 - TODO: 제거하기 */
export default function SharedComponentExample() {
  return (
    <div className="min-h-screen bg-black">
      <h1>badge</h1>
      <Badge type="d-day-label" theme="gray-100" content="d-day-label / gray-100" />
      <Badge type="d-day-label" theme="gray-white-outline" content="d-day-label / gray-white-outline" />
      <Badge type="d-day-label" theme="orange-50" content="d-day-label / orange-50" />
      <Badge type="d-day-label" theme="green-100" content="d-day-label / green-100" />
      <Badge type="d-day-label" theme="red-50" content="d-day-label / red-50" />
      <br />
      <Badge type="hard-label" theme="gray-100" content="hard-label /  gray-100" />
      <Badge type="hard-label" theme="gray-white-outline" content="hard-label / gray-white-outline" />
      <Badge type="hard-label" theme="orange-50" content="hard-label / orange-50" />
      <Badge type="hard-label" theme="green-100" content="hard-label / green-100" />
      <Badge type="hard-label" theme="red-50" content="hard-label / red-50" />
      <br />
      <br />
      <Badge type="star-label" theme="gray-100" content="star-label / gray-100" />
      <Badge type="star-label" theme="gray-white-outline" content="star-label / gray-white-outline" />
      <Badge type="star-label" theme="orange-50" content="star-label / orange-50" />
      <Badge type="star-label" theme="green-100" content="star-label / green-100" />
      <Badge type="star-label" theme="red-50" content="star-label / red-50" />
      <br />
      <Badge type="question-label" theme="gray-100" content="question-label / gray-100" />
      <Badge type="question-label" theme="gray-white-outline" content="question-label / gray-white-outline" />
      <Badge type="question-label" theme="orange-50" content="question-label / orange-50" />
      <Badge type="question-label" theme="green-100" content="question-label / green-100" />
      <Badge type="question-label" theme="red-50" content="question-label / red-50" />
    </div>
  )
}
