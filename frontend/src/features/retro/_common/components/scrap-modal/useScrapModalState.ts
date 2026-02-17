import { useCallback, useState } from 'react'

type UseScrapModalStateParams = {
  initialSelectedIds: Set<number>
  isMarkedDifficult: boolean
  onClose: () => void
}

export function useScrapModalState({ initialSelectedIds, isMarkedDifficult, onClose }: UseScrapModalStateParams) {
  const [selectedIds, setSelectedIds] = useState<Set<number> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [step, setStep] = useState<'list' | 'create'>('list')
  const [difficultSelection, setDifficultSelection] = useState<boolean | null>(null)
  const [folderName, setFolderName] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const effectiveSelectedIds = selectedIds ?? initialSelectedIds
  const effectiveDifficultSelection = difficultSelection ?? isMarkedDifficult

  const toggleFolder = useCallback(
    (folderId: number) => {
      setErrorMessage(null)
      setSelectedIds((prev) => {
        const base = prev ?? new Set(effectiveSelectedIds)
        const next = new Set(base)
        if (next.has(folderId)) next.delete(folderId)
        else next.add(folderId)
        return next
      })
    },
    [effectiveSelectedIds],
  )

  const goToCreateStep = useCallback(() => {
    setErrorMessage(null)
    setStep('create')
  }, [])

  const goToListStep = useCallback(() => {
    setFolderName('')
    setErrorMessage(null)
    setStep('list')
  }, [])

  const handleClose = useCallback(() => {
    setSelectedIds(null)
    setErrorMessage(null)
    setStep('list')
    setDifficultSelection(null)
    setFolderName('')
    onClose()
  }, [onClose])

  return {
    step,
    folderName,
    setFolderName,
    errorMessage,
    setErrorMessage,
    isSaving,
    setIsSaving,
    effectiveSelectedIds,
    effectiveDifficultSelection,
    setDifficultSelection,
    setStep,
    setSelectedIds,
    toggleFolder,
    goToCreateStep,
    goToListStep,
    handleClose,
  }
}
