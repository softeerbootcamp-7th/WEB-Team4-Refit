import { useMarkDifficultQuestion, useUnmarkDifficultQuestion } from '@/apis/generated/qna-set-api/qna-set-api'
import {
  useAddQnaSetToScrapFolder,
  useCreateScrapFolder,
  useRemoveQnaSetFromScrapFolder,
} from '@/apis/generated/scrap-folder-api/scrap-folder-api'

type UseScrapModalMutationsParams = {
  qnaSetId: number
  isMarkedDifficult: boolean
  onDifficultMarkedChange?: (isMarked: boolean) => void
  folderName: string
  initialSelectedIds: Set<number>
  effectiveSelectedIds: Set<number>
  effectiveDifficultSelection: boolean
  setErrorMessage: (message: string | null) => void
  setFolderName: (name: string) => void
  setStep: (step: 'list' | 'create') => void
  setSelectedIds: (value: Set<number> | null | ((prev: Set<number> | null) => Set<number> | null)) => void
  setIsSaving: (value: boolean) => void
  invalidateCurrentQnaSetFolders: () => Promise<unknown>
  invalidateAllQnaSetFoldersAndFolderList: () => Promise<unknown>
  handleClose: () => void
}

export function useScrapModalMutations({
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
  invalidateCurrentQnaSetFolders,
  invalidateAllQnaSetFoldersAndFolderList,
  handleClose,
}: UseScrapModalMutationsParams) {
  const { mutateAsync: createScrapFolder, isPending: isCreatingFolderPending } = useCreateScrapFolder()
  const { mutateAsync: markDifficultQuestion } = useMarkDifficultQuestion()
  const { mutateAsync: unmarkDifficultQuestion } = useUnmarkDifficultQuestion()
  const { mutateAsync: addQnaSetToFolder } = useAddQnaSetToScrapFolder()
  const { mutateAsync: removeQnaSetFromFolder } = useRemoveQnaSetFromScrapFolder()

  const handleCreateFolder = async () => {
    const trimmedName = folderName.trim()
    if (!trimmedName) {
      setErrorMessage('폴더 이름을 입력해주세요.')
      return
    }

    try {
      await createScrapFolder({ data: { scrapFolderName: trimmedName } })
      await invalidateAllQnaSetFoldersAndFolderList()
      setSelectedIds(null)
      setFolderName('')
      setStep('list')
      setErrorMessage(null)
    } catch {
      setErrorMessage('폴더 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 어려웠던 질문 mark/unmark
      if (effectiveDifficultSelection !== isMarkedDifficult) {
        if (effectiveDifficultSelection) await markDifficultQuestion({ qnaSetId })
        else await unmarkDifficultQuestion({ qnaSetId })
        onDifficultMarkedChange?.(effectiveDifficultSelection)
      }

      // 폴더 추가/삭제
      const addedIds = [...effectiveSelectedIds].filter((id) => !initialSelectedIds.has(id))
      const removedIds = [...initialSelectedIds].filter((id) => !effectiveSelectedIds.has(id))
      const hasFolderSelectionChanged = addedIds.length > 0 || removedIds.length > 0

      await Promise.all([
        ...addedIds.map((scrapFolderId) => addQnaSetToFolder({ scrapFolderId, qnaSetId })),
        ...removedIds.map((scrapFolderId) => removeQnaSetFromFolder({ scrapFolderId, qnaSetId })),
      ])

      if (hasFolderSelectionChanged) {
        await invalidateCurrentQnaSetFolders()
      }
    } catch {
      setErrorMessage('스크랩 저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
      setIsSaving(false)
      return
    }
    handleClose()
    setIsSaving(false)
  }

  return {
    isCreatingFolderPending,
    handleCreateFolder,
    handleSave,
  }
}
