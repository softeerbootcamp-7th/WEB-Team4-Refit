import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetMyProfileInfoQueryKey, useAgreeToTerms } from '@/apis/generated/user-api/user-api'
import { Button, Checkbox, Modal } from '@/designs/components'

type TermsModalProps = {
  open: boolean
  onClose: () => void
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  const queryClient = useQueryClient()
  const { mutate: agreeToTerms, isPending } = useAgreeToTerms({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetMyProfileInfoQueryKey() })
        onClose()
        setChecked(false)
      },
    },
  })
  const [checked, setChecked] = useState(false)

  const handleClose = () => {
    onClose()
    setChecked(false)
  }
  const handleAgree = () => {
    agreeToTerms()
  }

  return (
    <Modal open={open} onClose={handleClose} title="트렌드 질문 모아보기 서비스 이용 약관 동의" size="md">
      <div className="flex flex-col gap-6">
        <p className="body-m-medium text-center text-gray-600">
          본 동의는 트렌드 질문 모아보기 서비스 이용을 위한 필수 동의 약관입니다.
          <br />
          동의하지 않을 경우 해당 기능은 이용할 수 없으나, 개인 면접 기록 기능은 계속 이용할 수 있습니다.
        </p>
        <div className="flex max-h-[45vh] flex-col gap-4 overflow-y-auto rounded-xl bg-gray-100 p-5">
          <h3 className="title-s-semibold">[필수] 익명 면접 질문 데이터 활용 동의</h3>
          <div className="flex flex-col gap-2">
            <p className="body-l-semibold">1. 이용 목적</p>
            <p className="body-m-medium text-gray-700">
              여러 사용자가 입력한 면접 질문을 분석하여 자주 등장한 면접 질문을 카테고리별로 제공하기 위해 데이터를
              수집하고 활용합니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="body-l-semibold">2. 활용 항목</p>
            <ul className="body-m-medium list-disc pl-5 text-gray-700">
              <li>사용자가 입력한 면접 질문 내용</li>
              <li>사용자의 관심 산업군과 직군 정보</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <p className="body-l-semibold">3. 활용 방식</p>
            <p className="body-m-medium text-gray-700">
              면접 질문은 개인을 식별할 수 없는 형태로 익명 처리된 후 다른 사용자들의 질문과 함께 통계적으로
              분석·분류됩니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="body-l-semibold">4. 중요 안내</p>
            <ul className="body-m-medium list-disc pl-5 text-gray-700">
              <li>사용자가 입력한 면접 질문 일부는 빈출 면접 질문 데이터에 포함될 수 있습니다.</li>
              <li>질문 내용 외 이름, 회사명, 답변 내용, 작성자 정보 등 개인 식별 정보는 수집·공유하지 않습니다.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <p className="body-l-semibold">5. 보유 및 이용 기간</p>
            <p className="body-m-medium text-gray-700">빈출 질문 분석 및 서비스 제공 목적 달성 시까지</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Checkbox checked={checked} onChange={setChecked} label="데이터 활용에 동의합니다." />
          <Button
            size="sm"
            variant="fill-orange-500"
            disabled={!checked || isPending}
            isLoading={isPending}
            onClick={handleAgree}
          >
            동의하고 서비스 이용하기
          </Button>
        </div>
      </div>
    </Modal>
  )
}
