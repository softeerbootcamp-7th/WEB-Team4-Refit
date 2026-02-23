import { useRef, useState, type Ref } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetInterviewFullQueryKey } from '@/apis/generated/interview-api/interview-api'
import {
  getGetPdfHighlightingsQueryKey,
  useCreateStarAnalysis,
  useDeletePdfHighlighting,
  useDeleteQnaSet,
  useGetScrapFoldersContainingQnaSet,
  useUpdateQnaSet,
  useUpdateQnaSetSelfReview,
} from '@/apis/generated/qna-set-api/qna-set-api'
import { QnaSetCard, QnaSetEditForm, StarAnalysisSection } from '@/features/_common/_index/components/qna-set'
import { useOnClickOutside } from '@/features/_common/_index/hooks/useOnClickOutside'
import { getApiErrorCode } from '@/features/_common/_index/utils/error'
import { RetroWriteCard, ScrapModal } from '@/features/retro/_common/components'
import type { QnaSetType } from '@/types/interview'
import { BookmarkIcon, MoreIcon } from '@/ui/assets'
import { Border, Button } from '@/ui/components'
import ConfirmModal from '@/ui/components/modal/ConfirmModal'

type QnaRetroCardProps = {
  ref?: Ref<HTMLDivElement>
  idx: number
  qnaSet: QnaSetType
  isOtherEditing?: boolean
  onEditingIdChange?: (editingId: string | null) => void
}

const SCRAP_FOLDERS_STALE_TIME = 1000 * 60 * 30
const QNA_DELETE_FAILED_PDF_HIGHLIGHTING_EXISTS = 'QNA_DELETE_FAILED_PDF_HIGHLIGHTING_EXISTS'

export function QnaRetroCard({ ref, idx, qnaSet, isOtherEditing, onEditingIdChange }: QnaRetroCardProps) {
  const { interviewId, qnaSetId, questionText, answerText, qnaSetSelfReviewText, starAnalysis, isMarkedDifficult } =
    qnaSet
  const queryClient = useQueryClient()
  const { mutateAsync: updateQnaSet, isPending: isSavingQna } = useUpdateQnaSet()
  const { mutateAsync: updateQnaSetSelfReview, isPending: isSavingRetro } = useUpdateQnaSetSelfReview()
  const { mutateAsync: deleteQnaSet, isPending: isDeletingQnaSet } = useDeleteQnaSet()
  const { mutateAsync: deletePdfHighlighting, isPending: isDeletingPdfHighlighting } = useDeletePdfHighlighting()
  const { mutate: createStarAnalysis, isPending: isAnalyzing } = useCreateStarAnalysis()

  const { data: scrapFolderData } = useGetScrapFoldersContainingQnaSet(
    qnaSetId,
    { page: 0, size: 10 },
    {
      query: {
        enabled: qnaSetId > 0,
        staleTime: SCRAP_FOLDERS_STALE_TIME,
      },
    },
  )
  const hasAnyScrapFolder = (scrapFolderData?.result?.content ?? []).some((folder) => folder.contains)
  const [currentMarkedDifficult, setCurrentMarkedDifficult] = useState(isMarkedDifficult)
  const isBookmarked = currentMarkedDifficult || hasAnyScrapFolder

  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isDeleteWithHighlightConfirmOpen, setIsDeleteWithHighlightConfirmOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [editedQuestion, setEditedQuestion] = useState(questionText)
  const [editedAnswer, setEditedAnswer] = useState(answerText)
  const [editedRetro, setEditedRetro] = useState(qnaSetSelfReviewText)
  const [currentStarAnalysis, setCurrentStarAnalysis] = useState(starAnalysis)
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)
  const savedQuestionRef = useRef(questionText)
  const savedAnswerRef = useRef(answerText)
  const savedRetroRef = useRef(qnaSetSelfReviewText)

  const hasStarAnalysis = !!currentStarAnalysis
  const isQuestionEmpty = editedQuestion.trim() === ''
  const isSaving = isSavingQna || isSavingRetro

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(menuRef, () => setIsMenuOpen(false))

  const editingKey = `edit-${qnaSetId}`

  const invalidateAfterDelete = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetInterviewFullQueryKey(interviewId) }),
      queryClient.invalidateQueries({ queryKey: getGetPdfHighlightingsQueryKey(qnaSetId) }),
    ])
  }

  const startEditing = () => {
    setIsEditing(true)
    setSaveErrorMessage(null)
    setIsMenuOpen(false)
    onEditingIdChange?.(editingKey)
  }

  const stopEditing = () => {
    setIsEditing(false)
    setSaveErrorMessage(null)
    onEditingIdChange?.(null)
  }

  const handleSave = async (question: string, answer: string) => {
    if (isSaving) return
    if (question.trim() === '') return

    setSaveErrorMessage(null)

    const isQnaChanged = question !== savedQuestionRef.current || answer !== savedAnswerRef.current
    const isRetroChanged = editedRetro !== savedRetroRef.current

    if (!isQnaChanged && !isRetroChanged) {
      stopEditing()
      return
    }

    try {
      setEditedQuestion(question)
      setEditedAnswer(answer)

      if (isQnaChanged) {
        await updateQnaSet({
          qnaSetId,
          data: {
            questionText: question,
            answerText: answer,
          },
        })
        savedQuestionRef.current = question
        savedAnswerRef.current = answer
      }

      if (isRetroChanged) {
        await updateQnaSetSelfReview({ qnaSetId, data: { selfReviewText: editedRetro } })
        savedRetroRef.current = editedRetro
      }

      stopEditing()
    } catch {
      setSaveErrorMessage('저장에 실패했어요. 잠시 후 다시 시도해주세요.')
    }
  }

  const handleCancel = () => {
    setEditedRetro(savedRetroRef.current)
    stopEditing()
  }

  const handleDeleteRequest = () => {
    if (isDeletingQnaSet || isDeletingPdfHighlighting) return

    void deleteQnaSet({ qnaSetId })
      .then(() => {
        setIsDeleteConfirmOpen(false)
        return invalidateAfterDelete()
      })
      .catch((error) => {
        if (getApiErrorCode(error) === QNA_DELETE_FAILED_PDF_HIGHLIGHTING_EXISTS) {
          setIsDeleteConfirmOpen(false)
          setIsDeleteWithHighlightConfirmOpen(true)
          return
        }
      })
  }

  const handleDeleteWithHighlight = () => {
    void deletePdfHighlighting({ qnaSetId })
      .then(() => deleteQnaSet({ qnaSetId }))
      .then(() => {
        setIsDeleteWithHighlightConfirmOpen(false)
        return invalidateAfterDelete()
      })
      .catch(() => {})
  }

  const handleScrap = () => {
    setIsScrapModalOpen(true)
  }

  const handleAnalyze = () => {
    createStarAnalysis(
      { qnaSetId },
      {
        onSuccess: (res) => {
          setCurrentStarAnalysis(res.result)
        },
      },
    )
  }

  const containerClassName = `transition-opacity ${isOtherEditing ? 'pointer-events-none opacity-30' : ''}`
  const cardClassName = `relative rounded-lg transition-shadow ${isEditing ? 'border border-gray-300 shadow-md' : ''}`

  return (
    <div ref={ref} className={containerClassName}>
      <div className={cardClassName}>
        {!isEditing && (
          <div className="absolute top-6 right-4 z-10 flex items-center gap-2">
            <Button onClick={handleScrap} size="xs">
              <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'text-gray-400' : 'text-gray-white'}`} />
            </Button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <MoreIcon className="h-7 w-7" />
              </button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 z-10 mt-1 min-w-30 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black/5">
                  <button
                    onClick={startEditing}
                    className="body-s-medium w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsDeleteConfirmOpen(true)
                    }}
                    className="body-s-medium w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50"
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {isEditing && hasStarAnalysis ? (
          <QnaSetCard
            idx={idx}
            questionText={editedQuestion}
            answerText={editedAnswer}
            badgeTheme="gray-100"
            topRightComponent={
              <div className="flex flex-col items-end gap-1">
                <div className="flex gap-2">
                  <Button size="xs" variant="outline-gray-100" onClick={handleCancel}>
                    취소
                  </Button>
                  <Button
                    size="xs"
                    variant="outline-orange-100"
                    onClick={() => void handleSave(editedQuestion, editedAnswer)}
                    disabled={isQuestionEmpty}
                    isLoading={isSaving}
                  >
                    저장
                  </Button>
                </div>
                {saveErrorMessage && <p className="body-s-medium text-red-500">{saveErrorMessage}</p>}
              </div>
            }
          >
            <StarAnalysisSection
              starAnalysis={currentStarAnalysis}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
            <Border />
            <RetroWriteCard idx={idx} value={editedRetro} onChange={setEditedRetro} />
          </QnaSetCard>
        ) : isEditing ? (
          <QnaSetEditForm
            idx={idx}
            badgeTheme="gray-100"
            initialQuestion={editedQuestion}
            initialAnswer={editedAnswer}
            onSave={handleSave}
            onCancel={handleCancel}
          >
            <Border />
            <RetroWriteCard idx={idx} value={editedRetro} onChange={setEditedRetro} />
            {saveErrorMessage && <p className="body-s-medium mt-3 text-red-500">{saveErrorMessage}</p>}
          </QnaSetEditForm>
        ) : (
          <QnaSetCard idx={idx} questionText={editedQuestion} answerText={editedAnswer} badgeTheme="gray-100">
            <StarAnalysisSection
              starAnalysis={currentStarAnalysis}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
            {editedRetro && (
              <>
                <Border />
                <RetroWriteCard idx={idx} value={editedRetro} />
              </>
            )}
          </QnaSetCard>
        )}
      </div>
      <ScrapModal
        isOpen={isScrapModalOpen}
        onClose={() => setIsScrapModalOpen(false)}
        qnaSetId={qnaSetId}
        isMarkedDifficult={currentMarkedDifficult}
        onDifficultMarkedChange={setCurrentMarkedDifficult}
      />
      <ConfirmModal
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title={`질문을 정말\n삭제하시겠어요?`}
        description="삭제 후에는 되돌릴 수 없어요."
        hasCancelButton={true}
        cancelText="취소"
        okText="삭제하기"
        okButtonVariant="fill-gray-800"
        okButtonLoading={isDeletingQnaSet}
        onOk={handleDeleteRequest}
      />
      <ConfirmModal
        open={isDeleteWithHighlightConfirmOpen}
        onClose={() => setIsDeleteWithHighlightConfirmOpen(false)}
        title={`자기소개서 하이라이트\n연결 정보가 존재하는 항목입니다.\n정말 삭제하시겠습니까?`}
        hasCancelButton={true}
        cancelText="취소"
        okText="삭제하기"
        okButtonVariant="fill-gray-800"
        okButtonLoading={isDeletingQnaSet || isDeletingPdfHighlighting}
        onOk={handleDeleteWithHighlight}
      />
    </div>
  )
}
