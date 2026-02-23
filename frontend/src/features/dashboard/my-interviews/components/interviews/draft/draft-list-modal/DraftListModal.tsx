import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { GetMyInterviewDraftsInterviewDraftType } from '@/apis/generated/refit-api.schemas'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { ArrowLeftIcon, ArrowRightIcon } from '@/ui/assets'
import { Button, Modal, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/components'
import ConfirmModal from '@/ui/components/modal/ConfirmModal'
import { useDraftDelete } from './useDraftDelete'
import { useDraftList } from './useDraftList'

type DraftListModalProps = {
  open: boolean
  onClose: () => void
  interviewDraftType: GetMyInterviewDraftsInterviewDraftType
}

export default function DraftListModal({ open, onClose, interviewDraftType }: DraftListModalProps) {
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)

  const { page, setPage, visibleRows, totalCount, totalPages, draftType, isPending, markAsRemoved, resetList } =
    useDraftList(open, interviewDraftType)

  const { pendingDeleteId, setPendingDeleteId, isDeleting, handleConfirmDelete } = useDraftDelete(markAsRemoved)

  const handleClose = () => {
    resetList()
    setIsEditMode(false)
    onClose()
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        size="lg"
        title={
          <div className="flex items-center gap-2.5">
            <span className="title-l-bold">임시저장한 {draftType}</span>
            <span className="body-m-medium text-gray-500">
              총<span className="text-orange-500"> {totalCount}</span>개
            </span>
          </div>
        }
      >
        <div className="-mt-6 flex flex-col gap-5">
          <div className="flex justify-end">
            <Button size="xs" variant="outline-gray-white" onClick={() => setIsEditMode((prev) => !prev)}>
              {isEditMode ? '완료' : '편집'}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>최신순</TableHead>
                <TableHead>응시일</TableHead>
                <TableHead>회사</TableHead>
                <TableHead>직무</TableHead>
                <TableHead>면접 유형</TableHead>
                {isEditMode && <TableHead className="text-right">관리</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={isEditMode ? 6 : 5} className="body-s-regular text-gray-300">
                    로딩중...
                  </TableCell>
                </TableRow>
              ) : visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isEditMode ? 6 : 5}
                    className="body-s-regular hover:transparent pointer-events-none h-20 text-center text-gray-300"
                  >
                    임시저장한 {draftType} 데이터가 아직 없어요.
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, idx) => (
                  <TableRow
                    key={row.interviewId}
                    className={`h-10 ${!isEditMode ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={
                      !isEditMode
                        ? () => navigate(getInterviewNavigationPath(row.interviewId, row.interviewReviewStatus))
                        : undefined
                    }
                  >
                    <TableCell className="body-s-regular text-gray-400">{page * 10 + idx + 1}</TableCell>
                    <TableCell className="body-s-regular text-gray-300">{row.interviewStartAt}</TableCell>
                    <TableCell className="body-s-semibold">{row.companyName}</TableCell>
                    <TableCell>{row.jobCategoryName}</TableCell>
                    <TableCell>{INTERVIEW_TYPE_LABEL[row.interviewType]}</TableCell>
                    {isEditMode && (
                      <TableCell className="text-right">
                        <Button
                          size="xs"
                          variant="fill-orange-100"
                          disabled={isDeleting}
                          onClick={() => setPendingDeleteId(row.interviewId)}
                        >
                          삭제
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button size="xs" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
                <ArrowLeftIcon className="h-3 w-3" />
              </Button>
              <span className="body-s-regular text-gray-500">
                {page + 1} / {totalPages}
              </span>
              <Button size="xs" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                <ArrowRightIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title="임시저장 항목을 삭제할까요?"
        description={`삭제하면 연결된 면접 일정과\n관련 기록도 함께 삭제돼요`}
        hasCancelButton={true}
        cancelText="취소"
        okText="삭제"
        okButtonVariant="fill-gray-800"
        okButtonLoading={isDeleting}
        onOk={handleConfirmDelete}
      />
    </>
  )
}
