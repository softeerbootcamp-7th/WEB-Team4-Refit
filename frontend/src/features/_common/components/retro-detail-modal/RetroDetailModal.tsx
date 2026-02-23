import { useGetInterviewFull } from '@/apis/generated/interview-api/interview-api'
import { INTERVIEW_REVIEW_STATUS_LABEL } from '@/constants/interviewReviewStatus'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { SmallLogoIcon } from '@/designs/assets'
import { Badge, Border, Button, Modal } from '@/designs/components'
import { QnaSetCard } from '@/features/_common/components/qna-set'
import { StarAnalysisResultSection } from '@/features/_common/components/qna-set/StarAnalysisSection'
import { formatDate } from '@/features/_common/utils/date'
import { RESULT_LABEL, RESULT_THEME } from '@/features/dashboard/my-interviews/constants/constants'
import { RetroWriteCard } from '@/features/retro/_common/components'

type RetroDetailModalProps = {
  open: boolean
  onClose: () => void
  interviewId: number
  qnaSetId: number
  onMoveToDetails?: () => void
}

export default function RetroDetailModal({
  open,
  onClose,
  interviewId,
  qnaSetId,
  onMoveToDetails,
}: RetroDetailModalProps) {
  const { data, isPending, isError } = useGetInterviewFull(interviewId, {
    query: { enabled: open && interviewId > 0 },
  })

  const interview = data?.result
  const qnaSet = interview?.qnaSets?.find((item) => item.qnaSetId === qnaSetId) ?? null
  const resultStatus = interview?.interviewResultStatus ?? 'WAIT'
  const reviewStatus = interview?.interviewReviewStatus ?? 'DEBRIEF_COMPLETED'
  const interviewType = interview?.interviewType ?? 'FIRST'

  const goToDetailsPage = () => {
    onClose()
    onMoveToDetails?.()
  }

  const renderBody = () => {
    if (isPending) {
      return <p className="body-m-regular py-8 text-center text-gray-400">불러오는 중...</p>
    }
    if (isError) {
      return <p className="body-m-regular py-8 text-center text-red-400">상세 질문 정보를 불러오지 못했습니다.</p>
    }
    if (!qnaSet) {
      return <p className="body-m-regular py-8 text-center text-gray-400">질문 상세 데이터를 찾지 못했습니다.</p>
    }

    return (
      <QnaSetCard idx={0} questionText={qnaSet.questionText} answerText={qnaSet.answerText} badgeTheme="gray-100">
        {qnaSet.starAnalysis && <StarAnalysisResultSection starAnalysis={qnaSet.starAnalysis} />}
        <Border />
        <RetroWriteCard idx={0} value={qnaSet.qnaSetSelfReviewText} />
      </QnaSetCard>
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      className="mb-6 max-h-[80vh] overflow-y-scroll bg-gray-100! px-6 py-6"
    >
      <div className="-mt-10 flex min-h-0 flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge content={INTERVIEW_REVIEW_STATUS_LABEL[reviewStatus]} type="question-label" theme="gray-150" />
            <Badge content={RESULT_LABEL[resultStatus]} type="question-label" theme={RESULT_THEME[resultStatus]} />
            <span className="body-m-medium text-gray-500">{formatDate(interview?.interviewStartAt ?? '')} 응시</span>
          </div>
          <Border />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-white flex h-14 w-14 items-center justify-center rounded-full">
                {interview?.companyLogoUrl ? (
                  <img
                    src={interview.companyLogoUrl}
                    alt={`${interview?.companyName ?? ''} 로고`}
                    className="h-full w-full rounded-full object-contain"
                  />
                ) : (
                  <SmallLogoIcon className="h-7 w-7 text-gray-400" />
                )}
              </div>
              <h2 className="title-l-bold mr-1">{interview?.companyName ?? ''}</h2>
              <span className="body-m-medium text-gray-500">
                {interview?.jobRole ?? ''} <span className="mx-1 text-gray-200">|</span>
                {INTERVIEW_TYPE_LABEL[interviewType]}
              </span>
            </div>
            <Button variant="fill-gray-800" size="sm" onClick={goToDetailsPage}>
              상세 페이지로 이동
            </Button>
          </div>
        </div>
        {renderBody()}
      </div>
    </Modal>
  )
}
