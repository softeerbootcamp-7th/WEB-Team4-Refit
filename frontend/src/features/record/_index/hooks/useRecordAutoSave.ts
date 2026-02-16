import { useCallback, useEffect, useRef, useState } from 'react'
import { useStartLogging, useUpdateRawText } from '@/apis'

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type UseRecordAutoSaveParams = {
  interviewId?: string
  startLoggingRequired?: boolean
}

type UseRecordAutoSaveResult = {
  text: string
  onTextChange: (nextText: string) => void
  appendText: (nextText: string) => void
  autoSaveStatus: AutoSaveStatus
  ensureLoggingStarted: () => Promise<boolean>
}

const AUTO_SAVE_DEBOUNCE_MS = 1000

export function useRecordAutoSave({
  interviewId,
  startLoggingRequired = true,
}: UseRecordAutoSaveParams): UseRecordAutoSaveResult {
  const [text, setText] = useState('')
  const [hasStartedLogging, setHasStartedLogging] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [hasPendingAutoSave, setHasPendingAutoSave] = useState(false)
  const [isAutoSaveError, setIsAutoSaveError] = useState(false)
  const { mutateAsync: autoSaveRawText } = useUpdateRawText()
  const { mutateAsync: startLogging } = useStartLogging()
  const textRef = useRef('')
  const lastRequestedAutoSaveTextRef = useRef('')
  const lastAutoSaveRequestIdRef = useRef(0)
  const pendingAutoSaveCountRef = useRef(0)
  const startedLoggingRef = useRef(!startLoggingRequired)
  const startLoggingPromiseRef = useRef<Promise<boolean> | null>(null)
  const hasInputStartedRef = useRef(false)

  const ensureLoggingStarted = useCallback(async () => {
    if (!interviewId) return false
    if (!startLoggingRequired) return true
    if (startedLoggingRef.current) return true

    if (!startLoggingPromiseRef.current) {
      startLoggingPromiseRef.current = startLogging({ interviewId: Number(interviewId) })
        .then(() => {
          startedLoggingRef.current = true
          setHasStartedLogging(true)
          return true
        })
        .catch(() => false)
        .finally(() => {
          startLoggingPromiseRef.current = null
        })
    }

    const isStarted = await startLoggingPromiseRef.current
    if (!isStarted) {
      setIsAutoSaveError(true)
    }
    return isStarted
  }, [interviewId, startLogging, startLoggingRequired])

  const persistAutoSave = useCallback(
    async (rawText: string) => {
      if (!interviewId) return

      const requestId = ++lastAutoSaveRequestIdRef.current
      const numericInterviewId = Number(interviewId)

      lastRequestedAutoSaveTextRef.current = rawText
      pendingAutoSaveCountRef.current += 1
      setIsAutoSaving(true)
      setHasPendingAutoSave(false)
      setIsAutoSaveError(false)

      try {
        const isStarted = await ensureLoggingStarted()
        if (!isStarted) return

        await autoSaveRawText({
          interviewId: numericInterviewId,
          data: { rawText },
        })
      } catch {
        if (requestId !== lastAutoSaveRequestIdRef.current) return
        setIsAutoSaveError(true)
      } finally {
        pendingAutoSaveCountRef.current = Math.max(0, pendingAutoSaveCountRef.current - 1)
        if (pendingAutoSaveCountRef.current === 0) {
          setIsAutoSaving(false)
        }
      }
    },
    [autoSaveRawText, ensureLoggingStarted, interviewId],
  )

  const onTextChange = useCallback(
    (nextText: string) => {
      textRef.current = nextText
      setText(nextText)

      if (!hasInputStartedRef.current && !nextText.trim()) {
        setHasPendingAutoSave(false)
        return
      }

      if (!hasInputStartedRef.current) {
        hasInputStartedRef.current = true
        setHasStartedLogging(true)
        void persistAutoSave(nextText)
        return
      }

      setHasPendingAutoSave(nextText !== lastRequestedAutoSaveTextRef.current)
    },
    [persistAutoSave],
  )

  const appendText = useCallback(
    (nextText: string) => {
      if (!nextText) return
      const mergedText = `${textRef.current}${textRef.current ? ' ' : ''}${nextText}`
      onTextChange(mergedText)
    },
    [onTextChange],
  )

  useEffect(() => {
    if (!interviewId) return
    if (!hasInputStartedRef.current) return
    if (text === lastRequestedAutoSaveTextRef.current) return

    const timerId = window.setTimeout(() => {
      void persistAutoSave(text)
    }, AUTO_SAVE_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [interviewId, persistAutoSave, text])

  const autoSaveStatus = isAutoSaving
    || hasPendingAutoSave
    ? 'saving'
    : isAutoSaveError
      ? 'error'
      : hasStartedLogging
        ? 'saved'
        : 'idle'

  return {
    text,
    onTextChange,
    appendText,
    autoSaveStatus,
    ensureLoggingStarted,
  }
}
