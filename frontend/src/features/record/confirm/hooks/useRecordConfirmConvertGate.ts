import { useWaitConvertResult } from '@/apis'
import { getApiErrorCode } from '@/features/_common/utils/error'
import { shouldThrowInterviewRouteError } from '@/routes/interviewErrorRoute'

const CONVERT_PENDING_ERROR_CODE = 'INTERVIEW_CONVERTING_STATUS_IS_PENDING'
const CONVERT_IN_PROGRESS_ERROR_CODE = 'INTERVIEW_CONVERTING_IN_PROGRESS'
export const CONVERT_FAILED_ERROR_CODE = 'INTERVIEW_CONVERTING_FAILED'
const REFETCH_INTERVAL_MS = 1500

export type ConvertGateState = 'loading' | 'ready' | 'failed' | 'error'

type UseRecordConfirmConvertGateOptions = {
  interviewId: number
}

export function useRecordConfirmConvertGate({ interviewId }: UseRecordConfirmConvertGateOptions) {
  const { data, error, isPending, isError, refetch } = useWaitConvertResult(interviewId, {
    query: {
      throwOnError: shouldThrowInterviewRouteError,
      refetchInterval: (query) => {
        const errorCode = getApiErrorCode(query.state.error)
        if (errorCode === CONVERT_IN_PROGRESS_ERROR_CODE) {
          return REFETCH_INTERVAL_MS
        }
        return false
      },
    },
  })

  const convertStatus = data?.result?.convertStatus
  const errorCode = getApiErrorCode(error)
  const isPolling = isPending || errorCode === CONVERT_IN_PROGRESS_ERROR_CODE
  const isConvertFailed = errorCode === CONVERT_FAILED_ERROR_CODE || errorCode === CONVERT_PENDING_ERROR_CODE

  const state: ConvertGateState = (() => {
    if (isPolling) return 'loading'
    if (convertStatus === 'COMPLETED') return 'ready'
    if (isConvertFailed) return 'failed'
    if (isError) return 'error'
    return 'error'
  })()

  return {
    state,
    failureCode: isConvertFailed ? errorCode : undefined,
    refetchConvertResult: refetch,
  }
}
