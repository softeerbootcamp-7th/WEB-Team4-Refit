import { Badge } from '@/designs/components'

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

  const retroLabel = idx > 0 ? `${idx}번 회고` : '회고'

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="orange-100" content={retroLabel} />
      </div>
      {readOnly ? (
        <p className="body-m-regular mb-3 w-full break-all whitespace-pre-wrap">{value}</p>
      ) : (
        <div className="relative">
          <textarea
            className="body-m-regular outline-gray-150 min-h-40 w-full resize-none rounded-[10px] p-4 outline-1"
            value={value}
            onChange={handleChange}
            placeholder={`질문 ${idx}의 내 답변에 대한 회고를 작성해 보세요. 당시 면접장 분위기는 어땠나요? 기분은 어땠어요?\n준비한 질문이 나왔나요? 대답은 잘 한 것 같나요?\n아쉬웠던 점이나 배운 점도 좋아요. 자세히 작성할 수록 다음 면접을 대비하기 쉬워져요.`}
            maxLength={MAX_LENGTH}
          />
          <span className="body-s-regular bg-gray-white/80 pointer-events-none absolute right-3 bottom-4 rounded px-2 text-gray-300">
            {value.length}/{MAX_LENGTH}
          </span>
        </div>
      )}
    </div>
  )
}
