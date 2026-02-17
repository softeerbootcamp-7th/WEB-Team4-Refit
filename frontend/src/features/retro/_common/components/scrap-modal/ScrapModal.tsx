import { CheckIcon, FolderIcon, FolderPlusIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import Modal from '@/designs/components/modal'
import { useScrapModalController } from './useScrapModalController'

export type ScrapModalProps = {
  isOpen: boolean
  onClose: () => void
  qnaSetId: number
  isMarkedDifficult: boolean
  onDifficultMarkedChange?: (isMarked: boolean) => void
}

export function ScrapModal({ isOpen, onClose, qnaSetId, isMarkedDifficult, onDifficultMarkedChange }: ScrapModalProps) {
  const { viewState, actions } = useScrapModalController({
    isOpen,
    onClose,
    qnaSetId,
    isMarkedDifficult,
    onDifficultMarkedChange,
  })
  const {
    folders,
    step,
    folderName,
    errorMessage,
    isSaving,
    isCreatingFolderPending,
    effectiveSelectedIds,
    effectiveDifficultSelection,
  } = viewState
  const {
    setFolderName,
    setDifficultSelection,
    toggleFolder,
    goToCreateStep,
    goToListStep,
    handleCreateFolder,
    handleClose,
    handleSave,
  } = actions

  return (
    <>
      <Modal open={isOpen} onClose={handleClose} title="면접 질문 스크랩" size="md">
        <div className="flex flex-col gap-2">
          {step === 'list' ? (
            <>
              <div>
                <button
                  type="button"
                  onClick={goToCreateStep}
                  className={`hover:bg-gray-150 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors`}
                >
                  <FolderPlusIcon className="h-5 w-5 text-gray-700" />{' '}
                  <span className="title-s-medium text-gray-700">새 폴더 추가</span>
                </button>
              </div>
              <ul className="flex max-h-60 flex-col gap-2 overflow-y-auto">
                <li>
                  <button
                    type="button"
                    onClick={() => setDifficultSelection((prev) => !(prev ?? isMarkedDifficult))}
                    className={`hover:bg-gray-150 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${effectiveDifficultSelection ? 'bg-gray-150' : 'bg-white'}`}
                  >
                    <FolderIcon className="h-5 w-5 text-gray-700" />
                    <span className="title-s-medium flex-1 text-left text-gray-700">어려웠던 질문</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${effectiveDifficultSelection ? 'border-gray-800 bg-gray-800' : 'border-gray-300 bg-white'}`}
                    >
                      <CheckIcon
                        className={`h-3 w-3 ${effectiveDifficultSelection ? 'text-white' : 'text-gray-300'}`}
                      />
                    </span>
                  </button>
                </li>
                {folders.map((folder) => {
                  const id = folder.scrapFolderId ?? 0
                  const isChecked = effectiveSelectedIds.has(id)
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => toggleFolder(id)}
                        className={`hover:bg-gray-150 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${isChecked ? 'bg-gray-150' : 'bg-white'}`}
                      >
                        <FolderIcon className="h-5 w-5 text-gray-700" />
                        <span className="title-s-medium flex-1 text-left text-gray-700">{folder.scrapFolderName}</span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${isChecked ? 'border-gray-800 bg-gray-800' : 'border-gray-300 bg-white'}`}
                        >
                          <CheckIcon className={`h-3 w-3 ${isChecked ? 'text-white' : 'text-gray-300'}`} />
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="title-m-semibold text-gray-700">새 폴더 생성</p>
              <input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="title-s-medium h-14 w-full rounded-lg border border-gray-200 px-3 focus:outline-1 focus:outline-gray-300"
                placeholder="폴더 이름 입력"
                maxLength={30}
              />
            </div>
          )}
          {errorMessage ? <p className="body-s-medium px-2 text-red-500">{errorMessage}</p> : null}
          <div className="mt-4 flex gap-2">
            {step === 'list' ? (
              <>
                <Button variant="outline-gray-white" size="md" onClick={handleClose} className="flex-1/3">
                  취소
                </Button>
                <Button
                  variant="fill-gray-800"
                  size="md"
                  onClick={handleSave}
                  className="flex-2/3"
                  isLoading={isSaving}
                >
                  저장하기
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-gray-white" size="md" onClick={goToListStep} className="flex-1/3">
                  이전
                </Button>
                <Button
                  variant="fill-gray-800"
                  size="md"
                  onClick={handleCreateFolder}
                  className="flex-2/3"
                  isLoading={isCreatingFolderPending}
                >
                  생성하기
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
