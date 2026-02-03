import { useState, type PropsWithChildren } from 'react'
import { RetroContext, type RetroContextType } from './RetroContext'
import type { RetroListItem } from '../example'

type RetroProviderProps = PropsWithChildren<{
  retroList: RetroListItem[]
}>

export function RetroProvider({ children, retroList }: RetroProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentItem = retroList[currentIndex]

  const updateCurrentIndex = (targetIndex: number) => {
    setCurrentIndex(targetIndex)
  }

  const value: RetroContextType = {
    currentIndex,
    currentItem,
    totalCount: retroList.length,
    updateCurrentIndex,
  }

  return <RetroContext.Provider value={value}>{children}</RetroContext.Provider>
}
