import { useState } from 'react'
import Button from '@/shared/components/button'
import Input from '@/shared/components/input'
import Modal from '@/shared/components/modal'

interface FolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
  initialName?: string
  title: string
  submitLabel: string
}

const FolderModal = ({ isOpen, onClose, onSubmit, initialName = '', title, submitLabel }: FolderModalProps) => {
  const [name, setName] = useState(initialName)
  const [prevIsOpen, setPrevIsOpen] = useState(false)

  if (isOpen && !prevIsOpen) {
    setName(initialName)
    setPrevIsOpen(true)
  }
  if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name)
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={title} showCloseButton={true} isOutsideClickClosable>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Input
          placeholder="폴더 이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          required
        />
        <Button type="submit" className="flex-1" variant="fill-orange-500" size="lg" disabled={!name.trim()}>
          {submitLabel}
        </Button>
      </form>
    </Modal>
  )
}

export default FolderModal
