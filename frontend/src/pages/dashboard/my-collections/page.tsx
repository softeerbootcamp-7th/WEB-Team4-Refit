import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { PlusIcon } from '@/designs/assets'
import DeleteFolderModal from '@/features/dashboard/my-collections/components/DeleteFolderModal'
import FolderListItem from '@/features/dashboard/my-collections/components/FolderListItem'
import FolderModal from '@/features/dashboard/my-collections/components/FolderModal'

interface Folder {
  id: string
  name: string
  count: number
  isFixed?: boolean
}

export default function MyCollectionsPage() {
  const navigate = useNavigate()
  const { folderId } = useParams()

  const [folders, setFolders] = useState<Folder[]>([
    { id: 'difficult-questions', name: '어려웠던 질문', count: 0, isFixed: true },
    { id: '1', name: '면접 준비', count: 5 },
    { id: '2', name: 'CS 지식', count: 12 },
    { id: '3', name: '인성 면접', count: 8 },
  ])

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [folderToEditId, setFolderToEditId] = useState<string | null>(null)

  const selectedFolderId = folderId || 'difficult-questions'
  const selectedFolder = folders.find((f) => f.id === selectedFolderId)
  const folderToEdit = folders.find((f) => f.id === folderToEditId)

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      count: 0,
    }
    setFolders([...folders, newFolder])
    navigate(newFolder.id)
  }

  const handleEditFolder = (name: string) => {
    if (!folderToEditId) return
    setFolders(folders.map((f) => (f.id === folderToEditId ? { ...f, name } : f)))
    setFolderToEditId(null)
  }

  const handleDeleteFolder = () => {
    if (!folderToEditId) return
    setFolders(folders.filter((f) => f.id !== folderToEditId))

    if (folderId === folderToEditId) {
      navigate('difficult-questions')
    }

    setActiveModal(null)
    setFolderToEditId(null)
  }

  const openEditModal = (id: string) => {
    setFolderToEditId(id)
    setActiveModal('edit')
  }

  const openDeleteModal = (id: string) => {
    setFolderToEditId(id)
    setActiveModal('delete')
  }

  return (
    <div className="flex h-[calc(100vh-124px)] w-full overflow-hidden">
      <aside className="border-gray-150 flex w-[280px] shrink-0 flex-col rounded-2xl border-r bg-white">
        <div className="px-5 py-6">
          <button
            type="button"
            onClick={() => setActiveModal('create')}
            className="mb-6 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <PlusIcon className="h-5 w-5 shrink-0 text-gray-500" />
            <span className="body-s-medium">새로운 폴더</span>
          </button>
          <h1 className="body-m-bold mb-3 px-2 text-gray-700">나의 스크랩 폴더</h1>
          <div className="flex flex-col gap-1">
            {folders.map((folder) => (
              <FolderListItem
                key={folder.id}
                name={folder.name}
                count={folder.count}
                isFixed={folder.isFixed}
                isSelected={selectedFolderId === folder.id}
                onClick={() => navigate(folder.id)}
                onEdit={() => openEditModal(folder.id)}
                onDelete={() => openDeleteModal(folder.id)}
              />
            ))}
          </div>
        </div>
      </aside>

      <main className="h-full flex-1 overflow-hidden">
        <Outlet context={{ folderName: selectedFolder?.name }} />
      </main>

      <FolderModal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateFolder}
        title="폴더 생성"
        submitLabel="만들기"
      />

      <FolderModal
        isOpen={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleEditFolder}
        initialName={folderToEdit?.name}
        title="폴더 이름 변경"
        submitLabel="수정하기"
      />

      <DeleteFolderModal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleDeleteFolder}
        folderName={folderToEdit?.name || ''}
      />
    </div>
  )
}
