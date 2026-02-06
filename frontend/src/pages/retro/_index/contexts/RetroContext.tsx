import { createContext } from 'react'
import type { RetroListItem } from '../example'

export type RetroContextType = {
  currentIndex: number
  currentItem: RetroListItem // TODO: API 연결 시 수정 필요
  totalCount: number
  updateCurrentIndex: (targetIndex: number) => void
}

export const RetroContext = createContext<RetroContextType | null>(null)
