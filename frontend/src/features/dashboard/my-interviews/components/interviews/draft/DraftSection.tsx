import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useGetMyInterviewDrafts } from '@/apis/generated/interview-my-api/interview-my-api'
import type { GetMyInterviewDraftsInterviewDraftType } from '@/apis/generated/refit-api.schemas'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/designs/components'
import { mapDraftInterviewRow } from '@/features/dashboard/my-interviews/components/interviews/mappers'
import DraftListModal from './draft-list-modal/DraftListModal'

type DraftSectionProps = {
  interviewDraftType: GetMyInterviewDraftsInterviewDraftType
}

export default function DraftSection({ interviewDraftType }: DraftSectionProps) {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: items = [], isPending } = useGetMyInterviewDrafts(
    { interviewDraftType, page: 0, size: 5 },
    {
      query: {
        select: (response) => (response.result?.content ?? []).map(mapDraftInterviewRow),
      },
    },
  )
  const draftType = interviewDraftType === 'LOGGING' ? '기록' : '회고'

  return (
    <>
      <div className="bg-gray-white relative flex flex-1 flex-col rounded-lg p-5">
        <div className="absolute right-5">
          <Button size="xs" className="text-gray-400" onClick={() => setIsModalOpen(true)}>
            전체보기
          </Button>
        </div>
        <h3 className="body-l-semibold mb-5">임시저장한 {draftType}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>응시일</TableHead>
              <TableHead>회사</TableHead>
              <TableHead>직무</TableHead>
              <TableHead>면접 유형</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell className="body-s-regular text-gray-300" colSpan={4}>
                  로딩중...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  className="body-s-regular hover:transparent pointer-events-none h-20 text-center text-gray-300"
                  colSpan={4}
                >
                  임시저장한 {draftType} 데이터가 아직 없어요.
                </TableCell>
              </TableRow>
            ) : (
              items.map(
                ({ interviewId, interviewReviewStatus, interviewStartAt, company, jobCategoryName, interviewType }) => (
                  <TableRow
                    key={interviewId}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(getInterviewNavigationPath(interviewId, interviewReviewStatus))}
                  >
                    <TableCell className="body-s-regular text-gray-300">{interviewStartAt}</TableCell>
                    <TableCell className="body-s-semibold">{company}</TableCell>
                    <TableCell>{jobCategoryName}</TableCell>
                    <TableCell>{INTERVIEW_TYPE_LABEL[interviewType]}</TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </div>
      <DraftListModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        interviewDraftType={interviewDraftType}
      />
    </>
  )
}
