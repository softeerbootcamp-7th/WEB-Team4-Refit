import { ContentsContainer } from '@/features/confirm-record/components/contents/ContentsContainer'
import Button from '@/shared/Button'
import { FadeScrollArea } from '@/shared/components/FadeScrollArea'

const example = [
  {
    qnaSetId: 1,
    questionText: '짧은 질문입니다.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. ',
  },
  {
    qnaSetId: 2,
    questionText: '질문의 길이가 길어 줄을 넘어 두 줄까지 내려가는 경우에는 다음과 같은 형태로 배열됩니다.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
  {
    qnaSetId: 3,
    questionText: '질문의 길이가 길어 한 줄을 끝까지 채우는 경우에는 이렇게 배열됩니다.',
    answerText:
      '답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다. 답변은 글자수 제한 없이 작성될 수 있습니다.',
  },
]

export function RecordContents() {
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <h1 className="title-xl-bold">작성 내용을 확인해주세요.</h1>
      <FadeScrollArea className="-mr-4 space-y-3 pr-4">
        {example.map((qnaData, idx) => (
          <ContentsContainer qnaData={qnaData} idx={idx + 1} />
        ))}
      </FadeScrollArea>
      <div className="flex shrink-0 justify-end gap-3">
        <Button variant="outline-gray-100" size="lg" className="w-35">
          임시 저장
        </Button>
        <Button variant="fill-orange-500" size="lg" className="w-60">
          다음 단계
        </Button>
      </div>
    </div>
  )
}
