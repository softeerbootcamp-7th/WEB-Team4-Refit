import { useContext } from 'react'
import { RetroContext, type RetroContextType } from './RetroContext'

export function useRetroContext(): RetroContextType {
  const context = useContext(RetroContext)
  if (!context) throw new Error('useRetroContext must be used within RetroProvider')
  return context
}
