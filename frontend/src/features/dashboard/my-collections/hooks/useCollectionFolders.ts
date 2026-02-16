import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useGetMyScrapFolders } from '@/apis'
import {
  DIFFICULT_FOLDER_ID,
  DIFFICULT_FOLDER_NAME,
  mapScrapFolderToCollectionFolder,
  type CollectionFolderItem,
} from '@/features/dashboard/my-collections/mappers'

const FOLDER_PAGE_SIZE = 100

export function useCollectionFolders() {
  const navigate = useNavigate()
  const { folderId } = useParams()

  const { data: folderResponse, isPending: isFoldersPending, isError: isFoldersError } = useGetMyScrapFolders({
    page: 0,
    size: FOLDER_PAGE_SIZE,
  })

  const folders = useMemo<CollectionFolderItem[]>(() => {
    const normalFolders = (folderResponse?.result?.content ?? []).map(mapScrapFolderToCollectionFolder)
    return [{ id: DIFFICULT_FOLDER_ID, name: DIFFICULT_FOLDER_NAME, count: 0, isFixed: true }, ...normalFolders]
  }, [folderResponse?.result?.content])

  const selectedFolderId = folderId ?? DIFFICULT_FOLDER_ID
  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId)

  useEffect(() => {
    if (!folderId || isFoldersPending || isFoldersError) return

    const isExistingFolder = folders.some((folder) => folder.id === folderId)
    if (!isExistingFolder) {
      navigate(DIFFICULT_FOLDER_ID, { replace: true })
    }
  }, [folderId, folders, isFoldersError, isFoldersPending, navigate])

  return {
    folders,
    folderId,
    selectedFolderId,
    selectedFolder,
    isFoldersPending,
    isFoldersError,
    navigate,
  }
}
