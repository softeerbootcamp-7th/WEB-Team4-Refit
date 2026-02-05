import QnaCard from '@/pages/dashboard/_my_interviews/components/questions/QnaCard'
import { MOCK_QNA } from '@/pages/dashboard/_my_interviews/example'

export default function FilterResultList() {
  // TODO: API 호출 결과로 수정
  return (
    <section className="flex flex-col gap-3">
      <h2 className="title-s-bold">선택한 산업/직군 면접에서 자주 나온 질문</h2>
      {MOCK_QNA.length === 0 ? (
        <div className="bg-gray-white body-l-medium rounded-xl px-6 py-12 text-center text-gray-400">
          검색 결과가 없어요
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {MOCK_QNA.map((item, i) => (
            <QnaCard key={i} {...item} />
          ))}
        </div>
      )}
    </section>
  )
}
