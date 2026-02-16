import { useMemo, useState } from 'react'
import type { NavigateFunction } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  getGetMyScrapFoldersQueryKey,
  useCreateScrapFolder,
  useDeleteScrapFolder,
  useUpdateScrapFolderName,
} from '@/apis'
import { DIFFICULT_FOLDER_ID, type CollectionFolderItem } from '@/features/dashboard/my-collections/mappers'

type FolderModalType = 'create' | 'edit' | 'delete' | null

interface UseCollectionFolderMutationsOptions {
  folders: CollectionFolderItem[]
  folderId?: string
  navigate: NavigateFunction
}

export function useCollectionFolderMutations({ folders, folderId, navigate }: UseCollectionFolderMutationsOptions) {
  const queryClient = useQueryClient()

  const [activeModal, setActiveModal] = useState<FolderModalType>(null)
  const [folderToEditId, setFolderToEditId] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const { mutateAsync: createScrapFolder, isPending: isCreatePending } = useCreateScrapFolder()
  const { mutateAsync: updateScrapFolderName, isPending: isUpdatePending } = useUpdateScrapFolderName()
  const { mutateAsync: deleteScrapFolder, isPending: isDeletePending } = useDeleteScrapFolder()

  const folderToEdit = useMemo(
    () => folders.find((folder) => folder.id === folderToEditId),
    [folderToEditId, folders],
  )

  const refreshFolderList = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetMyScrapFoldersQueryKey() })
  }

  const closeModal = () => {
    setActiveModal(null)
    setFolderToEditId(null)
    setMutationError(null)
  }

  const handleCreateFolder = async (name: string) => {
    try {
      await createScrapFolder({ data: { scrapFolderName: name } })
      await refreshFolderList()
      return true
    } catch {
      setMutationError('폴더를 생성하지 못했어요. 잠시 후 다시 시도해 주세요.')
      return false
    }
  }

  const handleEditFolder = async (name: string) => {
    if (!folderToEdit?.scrapFolderId) return false

    try {
      await updateScrapFolderName({
        scrapFolderId: folderToEdit.scrapFolderId,
        data: { scrapFolderName: name },
      })
      await refreshFolderList()
      return true
    } catch {
      setMutationError('폴더 이름을 수정하지 못했어요. 잠시 후 다시 시도해 주세요.')
      return false
    }
  }

  const handleDeleteFolder = async () => {
    if (!folderToEdit?.scrapFolderId) return false

    try {
      await deleteScrapFolder({ scrapFolderId: folderToEdit.scrapFolderId })
      await refreshFolderList()

      if (folderId === folderToEdit.id) {
        navigate(DIFFICULT_FOLDER_ID, { replace: true })
      }

      return true
    } catch {
      setMutationError('폴더를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.')
      return false
    }
  }

  const openCreateModal = () => {
    setMutationError(null)
    setActiveModal('create')
  }

  const openEditModal = (id: string) => {
    setFolderToEditId(id)
    setMutationError(null)
    setActiveModal('edit')
  }

  const openDeleteModal = (id: string) => {
    setFolderToEditId(id)
    setMutationError(null)
    setActiveModal('delete')
  }

  return {
    modal: {
      activeModal,
      folderToEdit,
      folderToEditId,
      mutationError,
    },
    pending: {
      isCreatePending,
      isUpdatePending,
      isDeletePending,
    },
    actions: {
      closeModal,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      handleCreateFolder,
      handleEditFolder,
      handleDeleteFolder,
    },
  }
}
