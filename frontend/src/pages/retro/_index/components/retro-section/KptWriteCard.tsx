import { useState } from 'react'
import { Badge, Border } from '@/shared/components'
import type { KptTextsType } from '@/types/interview'

const KPT_MAX_LENGTH = 400

const KPT_SECTIONS = [
  { key: 'keep_text' as const, label: 'Keep', question: '계속 유지하고 싶은 것은 무엇인가요?' },
  { key: 'problem_text' as const, label: 'Problem', question: '어려움을 느꼈던 부분은 무엇인가요?' },
  { key: 'try_text' as const, label: 'Try', question: '새롭게 시도해 볼 내용은 무엇인가요?' },
]

type KptWriteCardProps = {
  readOnly?: boolean
}

export function KptWriteCard({ readOnly = false }: KptWriteCardProps) {
  const [kptTexts, setKptTexts] = useState<KptTextsType>({ keep_text: '', problem_text: '', try_text: '' })
  const handleChange = (key: keyof KptTextsType, value: string) => {
    if (value.length <= KPT_MAX_LENGTH) {
      setKptTexts({ ...kptTexts, [key]: value })
    }
  }

  return (
    <div className="bg-gray-white flex flex-col gap-5 rounded-lg p-5">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="orange-100" content="최종 KPT 회고" />
        <span className="title-m-semibold">마지막으로 면접을 종합적으로 회고해 보세요</span>
      </div>
      <Border />
      {KPT_SECTIONS.map(({ key, label, question }) => (
        <KptSection
          key={key}
          label={label}
          question={question}
          value={kptTexts[key]}
          onChange={(v) => handleChange(key, v)}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}

type KptSectionProps = {
  label: string
  question: string
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

function KptSection({ label, question, value, onChange, readOnly }: KptSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex items-center gap-2.5">
        <Badge type="question-label" theme="gray-100" content={label} />
        <span className="body-l-semibold">{question}</span>
      </div>

      <div className="relative">
        <textarea
          className="body-m-regular border-gray-150 min-h-36 w-full resize-none rounded-[10px] border p-4 focus-visible:border-gray-200 focus-visible:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? undefined : `${label}에 대해 작성해주세요.`}
          maxLength={KPT_MAX_LENGTH}
        />
        <span className="body-s-regular absolute right-4 bottom-4 text-gray-300">
          {value.length}/{KPT_MAX_LENGTH}
        </span>
      </div>
    </div>
  )
}
