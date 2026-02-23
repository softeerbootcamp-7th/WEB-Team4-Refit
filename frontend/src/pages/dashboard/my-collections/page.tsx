import { Outlet } from 'react-router'
import DeleteFolderModal from '@/features/dashboard/my-collections/components/DeleteFolderModal'
import FolderListItem from '@/features/dashboard/my-collections/components/FolderListItem'
import FolderListSkeleton from '@/features/dashboard/my-collections/components/FolderListSkeleton'
import FolderModal from '@/features/dashboard/my-collections/components/FolderModal'
import { useCollectionFolderMutations, useCollectionFolders } from '@/features/dashboard/my-collections/hooks'
import { PlusIcon } from '@/ui/assets'

export default function MyCollectionsPage() {
  const {
    folders,
    folderId,
    selectedFolderId,
    selectedFolder,
    loadMoreRef,
    isFoldersPending,
    isFetchingNextFolders,
    hasNextFolders,
    isFoldersError,
    navigate,
  } = useCollectionFolders()
  const { modal, pending, actions } = useCollectionFolderMutations({
    folders,
    folderId,
    navigate,
  })

  return (
    <div className="flex h-[calc(100vh-124px)] w-full overflow-hidden">
      <aside className="border-gray-150 flex h-full w-70 shrink-0 flex-col rounded-2xl border-r bg-white">
        <div className="flex h-full min-h-0 flex-col px-5 py-6">
          <button
            type="button"
            onClick={actions.openCreateModal}
            className="mb-6 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <PlusIcon className="h-5 w-5 shrink-0 text-gray-500" />
            <span className="body-s-medium">새로운 폴더</span>
          </button>

          <h1 className="body-m-bold mb-3 px-2 text-gray-700">나의 스크랩 폴더</h1>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {folders.map((folder) => (
                <FolderListItem
                  key={folder.id}
                  name={folder.name}
                  count={folder.count}
                  isFixed={folder.isFixed}
                  isSelected={selectedFolderId === folder.id}
                  onClick={() => navigate(folder.id)}
                  onEdit={() => actions.openEditModal(folder.id)}
                  onDelete={() => actions.openDeleteModal(folder.id)}
                />
              ))}

              {isFoldersPending && <FolderListSkeleton />}
              {!isFoldersPending && isFetchingNextFolders && <FolderListSkeleton />}
              {hasNextFolders && <div ref={loadMoreRef} className="h-4 w-full" aria-hidden />}
            </div>
          </div>

          {isFoldersError && (
            <p className="body-s-medium mt-3 px-2 text-red-500">
              폴더 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </p>
          )}
        </div>
      </aside>

      <section className="h-full flex-1 overflow-hidden">
        <Outlet context={{ folderName: selectedFolder?.name }} />
      </section>

      <FolderModal
        key={modal.activeModal === 'create' ? 'create-open' : 'create-closed'}
        isOpen={modal.activeModal === 'create'}
        onClose={actions.closeModal}
        onSubmit={actions.handleCreateFolder}
        title="폴더 생성"
        submitLabel="생성하기"
        errorMessage={modal.activeModal === 'create' ? modal.mutationError : null}
        isSubmitting={pending.isCreatePending}
      />

      <FolderModal
        key={modal.activeModal === 'edit' ? `edit-open-${modal.folderToEditId ?? 'none'}` : 'edit-closed'}
        isOpen={modal.activeModal === 'edit'}
        onClose={actions.closeModal}
        onSubmit={actions.handleEditFolder}
        initialName={modal.folderToEdit?.name}
        title="폴더 이름 변경"
        submitLabel="수정하기"
        errorMessage={modal.activeModal === 'edit' ? modal.mutationError : null}
        isSubmitting={pending.isUpdatePending}
      />

      <DeleteFolderModal
        isOpen={modal.activeModal === 'delete'}
        onClose={actions.closeModal}
        onConfirm={actions.handleDeleteFolder}
        folderName={modal.folderToEdit?.name ?? ''}
        errorMessage={modal.activeModal === 'delete' ? modal.mutationError : null}
        isSubmitting={pending.isDeletePending}
      />
    </div>
  )
}
