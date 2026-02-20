import { useCallback, useEffect, useRef, useState } from 'react'
import { useStartLogging, useUpdateRawText } from '@/apis'
import { HttpError } from '@/apis/custom-fetch'

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type UseRecordAutoSaveParams = {
  interviewId?: string
  startLoggingRequired?: boolean
  initialText?: string
}

type UseRecordAutoSaveResult = {
  text: string
  onTextChange: (nextText: string) => void
  appendText: (nextText: string) => void
  autoSaveStatus: AutoSaveStatus
  autoSaveErrorMessage: string | null
  ensureLoggingStarted: () => Promise<boolean>
  flushAutoSave: (rawText?: string) => Promise<void>
}

const AUTO_SAVE_DEBOUNCE_MS = 1000

export function useRecordAutoSave({
  interviewId,
  startLoggingRequired = true,
  initialText = '',
}: UseRecordAutoSaveParams): UseRecordAutoSaveResult {
  const [text, setText] = useState(initialText)
  const [hasStartedLogging, setHasStartedLogging] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [hasPendingAutoSave, setHasPendingAutoSave] = useState(false)
  const [isAutoSaveError, setIsAutoSaveError] = useState(false)
  const [autoSaveErrorMessage, setAutoSaveErrorMessage] = useState<string | null>(null)
  const { mutateAsync: autoSaveRawText } = useUpdateRawText()
  const { mutateAsync: startLogging } = useStartLogging()
  const textRef = useRef(initialText)
  const lastRequestedAutoSaveTextRef = useRef('')
  const lastAutoSaveRequestIdRef = useRef(0)
  const pendingAutoSaveCountRef = useRef(0)
  const startedLoggingRef = useRef(!startLoggingRequired)
  const startLoggingPromiseRef = useRef<Promise<boolean> | null>(null)
  const hasInputStartedRef = useRef(false)
  const autoSaveTimerRef = useRef<number | null>(null)
  const inFlightAutoSavePromisesRef = useRef<Set<Promise<void>>>(new Set())

  const ensureLoggingStarted = useCallback(async () => {
    if (!interviewId) return false
    if (!startLoggingRequired) return true
    if (startedLoggingRef.current) return true

    if (!startLoggingPromiseRef.current) {
      startLoggingPromiseRef.current = startLogging({ interviewId: Number(interviewId) })
        .then(() => {
          startedLoggingRef.current = true
          setHasStartedLogging(true)
          setAutoSaveErrorMessage(null)
          return true
        })
        .catch((error) => {
          setAutoSaveErrorMessage(getApiErrorMessage(error))
          return false
        })
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
      setAutoSaveErrorMessage(null)

      try {
        const isStarted = await ensureLoggingStarted()
        if (!isStarted) return

        await autoSaveRawText({
          interviewId: numericInterviewId,
          data: { rawText },
        })
      } catch (error) {
        if (requestId !== lastAutoSaveRequestIdRef.current) return
        setIsAutoSaveError(true)
        setAutoSaveErrorMessage(getApiErrorMessage(error))
      } finally {
        pendingAutoSaveCountRef.current = Math.max(0, pendingAutoSaveCountRef.current - 1)
        if (pendingAutoSaveCountRef.current === 0) {
          setIsAutoSaving(false)
        }
      }
    },
    [autoSaveRawText, ensureLoggingStarted, interviewId],
  )

  const requestAutoSave = useCallback(
    (rawText: string) => {
      const autoSavePromise = persistAutoSave(rawText)
      inFlightAutoSavePromisesRef.current.add(autoSavePromise)
      void autoSavePromise.finally(() => {
        inFlightAutoSavePromisesRef.current.delete(autoSavePromise)
      })
      return autoSavePromise
    },
    [persistAutoSave],
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
        void requestAutoSave(nextText)
        return
      }

      setHasPendingAutoSave(nextText !== lastRequestedAutoSaveTextRef.current)
    },
    [requestAutoSave],
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
    if (autoSaveTimerRef.current !== null) {
      window.clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
    if (!interviewId) return
    if (!hasInputStartedRef.current) return
    if (text === lastRequestedAutoSaveTextRef.current) return

    autoSaveTimerRef.current = window.setTimeout(() => {
      autoSaveTimerRef.current = null
      void requestAutoSave(text)
    }, AUTO_SAVE_DEBOUNCE_MS)

    return () => {
      if (autoSaveTimerRef.current !== null) {
        window.clearTimeout(autoSaveTimerRef.current)
        autoSaveTimerRef.current = null
      }
    }
  }, [interviewId, requestAutoSave, text])

  const flushAutoSave = useCallback(
    async (rawText?: string) => {
      const targetText = rawText ?? textRef.current

      if (autoSaveTimerRef.current !== null) {
        window.clearTimeout(autoSaveTimerRef.current)
        autoSaveTimerRef.current = null
      }
      setHasPendingAutoSave(false)
      if (!interviewId) return

      if (inFlightAutoSavePromisesRef.current.size > 0) {
        await Promise.allSettled(Array.from(inFlightAutoSavePromisesRef.current))
      }
      if (!targetText.trim()) return

      if (!hasInputStartedRef.current) {
        hasInputStartedRef.current = true
        setHasStartedLogging(true)
      }

      if (targetText !== lastRequestedAutoSaveTextRef.current || isAutoSaveError) {
        await requestAutoSave(targetText)
      }

      if (inFlightAutoSavePromisesRef.current.size > 0) {
        await Promise.allSettled(Array.from(inFlightAutoSavePromisesRef.current))
      }
    },
    [interviewId, isAutoSaveError, requestAutoSave],
  )

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
    autoSaveErrorMessage,
    ensureLoggingStarted,
    flushAutoSave,
  }
}

function getApiErrorMessage(error: unknown): string {
  if (error instanceof HttpError && error.payload && typeof error.payload === 'object') {
    const message = (error.payload as { message?: unknown }).message
    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }
  return '저장 실패'
}
