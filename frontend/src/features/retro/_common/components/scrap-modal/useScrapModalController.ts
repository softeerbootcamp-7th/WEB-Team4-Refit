import { useScrapModalFolders } from './useScrapModalFolders'
import { useScrapModalMutations } from './useScrapModalMutations'
import { useScrapModalState } from './useScrapModalState'

type UseScrapModalControllerParams = {
  isOpen: boolean
  onClose: () => void
  qnaSetId: number
  isMarkedDifficult: boolean
  onDifficultMarkedChange?: (isMarked: boolean) => void
}

export function useScrapModalController({
  isOpen,
  onClose,
  qnaSetId,
  isMarkedDifficult,
  onDifficultMarkedChange,
}: UseScrapModalControllerParams) {
  const { folders, initialSelectedIds, invalidateFolders } = useScrapModalFolders(qnaSetId, isOpen)

  const {
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
  } = useScrapModalState({
    initialSelectedIds,
    isMarkedDifficult,
    onClose,
  })

  const { isCreatingFolderPending, handleCreateFolder, handleSave } = useScrapModalMutations({
    qnaSetId,
    isMarkedDifficult,
    onDifficultMarkedChange,
    folderName,
    initialSelectedIds,
    effectiveSelectedIds,
    effectiveDifficultSelection,
    setErrorMessage,
    setFolderName,
    setStep,
    setSelectedIds,
    setIsSaving,
    invalidateFolders,
    handleClose,
  })

  return {
    viewState: {
      folders,
      step,
      folderName,
      errorMessage,
      isSaving,
      isCreatingFolderPending,
      effectiveSelectedIds,
      effectiveDifficultSelection,
      isMarkedDifficult,
    },
    actions: {
      setStep,
      setFolderName,
      setDifficultSelection,
      toggleFolder,
      goToCreateStep,
      goToListStep,
      handleCreateFolder,
      handleClose,
      handleSave,
    },
  }
}
