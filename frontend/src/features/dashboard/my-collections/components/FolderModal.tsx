import { useState } from 'react'
import Button from '@/ui/components/button'
import Input from '@/ui/components/input'
import Modal from '@/ui/components/modal'

interface FolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void | boolean | Promise<void | boolean>
  initialName?: string
  title: string
  submitLabel: string
  errorMessage?: string | null
  isSubmitting?: boolean
}

const FolderModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
  title,
  submitLabel,
  errorMessage,
  isSubmitting = false,
}: FolderModalProps) => {
  const [name, setName] = useState(initialName)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const shouldClose = await onSubmit(name.trim())
    if (shouldClose === false) return

    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={title} showCloseButton={true} isOutsideClickClosable>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="폴더 이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={10}
            required
          />
          <p className="body-s-medium text-right text-gray-400">최대 10자</p>
          {errorMessage && <p className="body-s-medium text-red-500">{errorMessage}</p>}
        </div>
        <Button
          type="submit"
          className="flex-1"
          variant="fill-orange-500"
          size="md"
          disabled={!name.trim()}
          isLoading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </form>
    </Modal>
  )
}

export default FolderModal
