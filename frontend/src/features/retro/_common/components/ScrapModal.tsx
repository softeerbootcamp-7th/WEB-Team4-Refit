import { useState } from 'react'
import { useGetScrapFoldersContainingQnaSet } from '@/apis/generated/qna-set-api/qna-set-api'
import { CheckIcon, FolderIcon, FolderPlusIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import Modal from '@/designs/components/modal'

export type ScrapModalProps = {
  isOpen: boolean
  onClose: () => void
  qnaSetId: number
}

export function ScrapModal({ isOpen, onClose, qnaSetId }: ScrapModalProps) {
  const { data } = useGetScrapFoldersContainingQnaSet(
    qnaSetId,
    { pageable: { page: 0, size: 5 } },
    { query: { enabled: isOpen } },
  )
  const folders = data?.result?.content ?? []

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const toggleFolder = (folderId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) next.delete(folderId)
      else next.add(folderId)
      return next
    })
  }

  const handleSave = () => {
    // TODO: 스크랩 토글 API 연동
    console.log('스크랩 저장', { qnaSetId, selectedFolderIds: [...selectedIds] })
    onClose()
  }

  return (
    <>
      <Modal open={isOpen} onClose={onClose} title="면접 질문 스크랩" size="md">
        <div className="flex flex-col gap-2">
          <div>
            {/* TODO: 새 폴더 추가 로직 구현 필요 */}
            <button
              type="button"
              onClick={() => {}}
              className={`hover:bg-gray-150 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors`}
            >
              <FolderPlusIcon className="h-5 w-5 text-gray-700" />{' '}
              <span className="title-s-medium text-gray-700">새 폴더 추가</span>
            </button>
          </div>
          <ul className="flex max-h-60 flex-col gap-2 overflow-y-auto">
            {folders.map((folder) => {
              const id = folder.scrapFolderId ?? 0
              const isChecked = selectedIds.has(id)
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
          <div className="mt-4 flex gap-2">
            <Button variant="outline-gray-white" size="md" onClick={onClose} className="flex-1/3">
              취소
            </Button>
            <Button variant="fill-gray-800" size="md" onClick={handleSave} className="flex-2/3">
              저장하기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
