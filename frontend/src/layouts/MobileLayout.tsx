import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { MobileNavbar } from '@/designs/components'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'

const isSpeechRecognitionSupported = () => {
  if (typeof window === 'undefined') return false
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export default function MobileLayout() {
  const navigate = useNavigate()
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(() => !isSpeechRecognitionSupported())

  const handleUnsupportedModalOk = () => {
    setShowUnsupportedModal(false)
    navigate(-1)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-gray-100">
      <div className="bg-gray-white flex min-h-dvh w-full max-w-120 flex-col shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
        <MobileNavbar />
        <main className="flex min-h-0 flex-1 flex-col overflow-auto pt-15">
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        open={showUnsupportedModal}
        onClose={handleUnsupportedModalOk}
        onOk={handleUnsupportedModalOk}
        title="미지원 브라우저에요"
        description="Chrome 또는 Safari의 최신 버전을 사용해주세요."
        okButtonVariant="fill-gray-800"
        okText="확인"
        hasCancelButton={false}
      />
    </div>
  )
}
