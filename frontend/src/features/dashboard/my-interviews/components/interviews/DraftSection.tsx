import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components'
import { INTERVIEW_TYPE_LABEL } from '@/shared/constants/interviews'
import { MOCK_DRAFTS } from '../../example'

type DraftSectionProps = {
  interviewReviewStatus: 'not_logged' | 'log_draft' | 'self_review_draft' | 'debrief_completed'
}

export default function DraftSection({ interviewReviewStatus }: DraftSectionProps) {
  const items = MOCK_DRAFTS
  const draftType = interviewReviewStatus === 'log_draft' ? '기록' : '회고'

  return (
    <div className="bg-gray-white relative flex flex-1 flex-col rounded-lg p-5">
      <div className="absolute right-5">
        <Button size="xs" className="text-gray-400">
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
          {items.map(({ interviewId, interviewStartAt, company, jobCategoryName, interviewType }) => (
            <TableRow key={interviewId}>
              <TableCell className="body-s-regular text-gray-300">{interviewStartAt}</TableCell>
              <TableCell className="body-s-semibold">{company}</TableCell>
              <TableCell>{jobCategoryName}</TableCell>
              <TableCell>{INTERVIEW_TYPE_LABEL[interviewType]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
