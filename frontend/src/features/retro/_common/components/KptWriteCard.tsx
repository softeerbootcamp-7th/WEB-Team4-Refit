import { useState } from 'react'
import { KPT_SECTIONS } from '@/constants/retro'
import type { KptTextsType } from '@/types/interview'
import { Badge, Border } from '@/ui/components'

const KPT_INITIAL_VALUE: KptTextsType = { keepText: '', problemText: '', tryText: '' }
const MAX_KPT_LENGTH = 8000

type KptWriteCardProps = {
  defaultValue?: KptTextsType
  readOnly?: boolean
  onChange?: (kptTexts: KptTextsType) => void
  saveErrorMessage?: string | null
}

export function KptWriteCard({ defaultValue, readOnly = false, onChange, saveErrorMessage }: KptWriteCardProps) {
  const [kptTexts, setKptTexts] = useState<KptTextsType>(defaultValue ?? KPT_INITIAL_VALUE)

  const handleChange = (key: keyof KptTextsType, value: string) => {
    const updated = { ...kptTexts, [key]: value }
    setKptTexts(updated)
    onChange?.(updated)
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
      {saveErrorMessage && <p className="body-s-medium text-red-500">{saveErrorMessage}</p>}
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
        <span className="mb-6 max-h-50 overflow-y-scroll break-all whitespace-pre-wrap">{value}</span>
      ) : (
        <div className="relative">
          <textarea
            className={`body-m-regular border-gray-150 min-h-36 w-full resize-none rounded-[10px] border p-4 focus-visible:outline-none ${readOnly ? '' : 'focus-visible:border-gray-200'}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            maxLength={MAX_KPT_LENGTH}
            placeholder={readOnly ? undefined : `${label}에 대해 작성해주세요.`}
          />
          <span className="body-s-regular bg-gray-white/80 pointer-events-none absolute right-3 bottom-4 rounded px-2 text-gray-300">
            {value.length}/{MAX_KPT_LENGTH}
          </span>
        </div>
      )}
    </div>
  )
}
