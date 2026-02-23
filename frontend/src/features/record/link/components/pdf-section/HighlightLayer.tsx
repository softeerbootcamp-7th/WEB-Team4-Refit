import type { HighlightRect } from '@/features/record/link/contexts'

type SavedRect = HighlightRect & { qnaSetId: number; rectIndex: number }

type HighlightLayerProps = {
  savedRects: SavedRect[]
  pendingRects: HighlightRect[]
  onSavedRectClick?: (qnaSetId: number) => void
}

export function HighlightLayer({ savedRects, pendingRects, onSavedRectClick }: HighlightLayerProps) {
  return (
    <>
      {savedRects.map((rect) => (
        <HighlightRectDiv
          key={`saved-${rect.qnaSetId}-${rect.rectIndex}`}
          rect={rect}
          variant="saved"
          onClick={onSavedRectClick ? () => onSavedRectClick(rect.qnaSetId) : undefined}
        />
      ))}
      {pendingRects.map((rect, i) => (
        <HighlightRectDiv key={`pending-${i}`} rect={rect} variant="pending" />
      ))}
    </>
  )
}

type HighlightRectDivProps = {
  rect: HighlightRect
  variant: 'saved' | 'pending'
  onClick?: () => void
}

function HighlightRectDiv({ rect, variant, onClick }: HighlightRectDivProps) {
  const bgColor = variant === 'saved' ? 'bg-yellow-400/40' : 'bg-gray-300/40'
  const interactiveClassName = onClick
    ? 'pointer-events-auto cursor-pointer hover:bg-yellow-400/55'
    : 'pointer-events-none'

  return (
    <div
      className={`absolute transition-colors ${bgColor} ${interactiveClassName}`}
      onClick={onClick}
      style={{
        left: `${rect.x * 100}%`,
        top: `${rect.y * 100}%`,
        width: `${rect.width * 100}%`,
        height: `${rect.height * 100}%`,
      }}
    />
  )
}
