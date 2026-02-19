import { CornerDownRightIcon } from '@/designs/assets'
import { Badge } from '@/designs/components'

type QnaSetCardProps = {
  idx: number
  questionText: string
  answerText: string
  badgeTheme?: 'orange-100' | 'gray-100'
  topRightComponent?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  className?: string
  children?: React.ReactNode
}

export function QnaSetCard({
  idx,
  questionText,
  answerText,
  badgeTheme = 'orange-100',
  topRightComponent,
  ref,
  className = '',
  children,
}: QnaSetCardProps) {
  const questionLabel = `${idx}번 질문`

  return (
    <div ref={ref} className={`bg-gray-white flex flex-col gap-6 rounded-lg p-5 ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-1 items-center justify-between">
          <Badge type="question-label" theme={badgeTheme} content={questionLabel} />
          {topRightComponent}
        </div>
        <p className="title-s-semibold shrink-0 wrap-break-word">{questionText}</p>
        <div className="ml-2 flex gap-4">
          <CornerDownRightIcon className="h-4 w-4 shrink-0 text-gray-600" />
          <span className="max-h-50 overflow-y-auto wrap-break-word">{answerText}</span>
        </div>
      </div>
      {children}
    </div>
  )
}
