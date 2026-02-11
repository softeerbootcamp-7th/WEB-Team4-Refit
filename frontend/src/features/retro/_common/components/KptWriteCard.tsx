import { useState } from 'react'
import { KPT_SECTIONS } from '@/constants/retro'
import { Badge, Border } from '@/shared/components'
import type { KptTextsType } from '@/types/interview'

const KPT_MAX_LENGTH = 400
const KPT_INITIAL_VALUE: KptTextsType = { keepText: '', problemText: '', tryText: '' }

type KptWriteCardProps = {
  defaultValue?: KptTextsType
  readOnly?: boolean
  onChange?: (kptTexts: KptTextsType) => void
}

export function KptWriteCard({ defaultValue, readOnly = false, onChange }: KptWriteCardProps) {
  const [kptTexts, setKptTexts] = useState<KptTextsType>(defaultValue ?? KPT_INITIAL_VALUE)

  const handleChange = (key: keyof KptTextsType, value: string) => {
    if (value.length <= KPT_MAX_LENGTH) {
      const updated = { ...kptTexts, [key]: value }
      setKptTexts(updated)
      onChange?.(updated)
    }
  }

  return (
    <div className="bg-gray-white flex flex-col gap-5 rounded-lg p-5">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="gray-600" content="최종 KPT 회고" />
        <span className="title-s-semibold">마지막으로 면접을 종합적으로 회고해 보세요</span>
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
      {readOnly ? (
        <span className="mb-6">{value}</span>
      ) : (
        <div className="relative">
          <textarea
            className={`body-m-regular border-gray-150 min-h-36 w-full resize-none rounded-[10px] border p-4 focus-visible:outline-none ${readOnly ? '' : 'focus-visible:border-gray-200'}`}
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
      )}
    </div>
  )
}
