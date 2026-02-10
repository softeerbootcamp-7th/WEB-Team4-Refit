import { useContext } from 'react'
import { HighlightContext, type HighlightContextType } from './HighlightContext'

export function useHighlightContext(): HighlightContextType {
  const context = useContext(HighlightContext)
  if (!context) throw new Error('useHighlightContext must be used within HighlightProvider')
  return context
}
