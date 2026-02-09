import { Badge, Border } from '@/shared/components'

const MAX_LENGTH = 500

type RetroWriteCardProps = {
  idx: number
  value: string
  onChange?: (text: string) => void
}

export function RetroWriteCard({ idx, value, onChange }: RetroWriteCardProps) {
  const readOnly = !onChange

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_LENGTH) {
      onChange?.(text)
    }
  }

  const cardTitle = readOnly ? `${idx}번 질문에 대한 회고` : `${idx}번에 대한 회고를 작성해 보세요`

  return (
    <div className="bg-gray-white flex flex-col gap-4 rounded-lg p-5">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="orange-100" content={`${idx}번 회고`} />
        <span className="title-m-semibold">{cardTitle}</span>
      </div>
      <Border />
      <div className="relative">
        <textarea
          className={`body-m-regular min-h-40 w-full resize-none rounded-[10px] p-4 ${
            readOnly ? 'border-none focus-visible:outline-none' : 'outline-gray-150 outline-1'
          }`}
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={
            readOnly
              ? undefined
              : `질문 ${idx}의 내 답변에 대한 회고를 작성해 보세요. 당시 면접장 분위기는 어땠나요? 기분은 어땠어요?\n준비한 질문이 나왔나요? 대답은 잘 한 것 같나요?\n아쉬웠던 점이나 배운 점도 좋아요. 자세히 작성할 수록 다음 면접을 대비하기 쉬워져요.`
          }
          maxLength={MAX_LENGTH}
        />
        <span className="body-s-regular absolute right-4 bottom-4 text-gray-300">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  )
}
