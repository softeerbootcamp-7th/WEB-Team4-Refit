import { useWaitConvertResult } from '@/apis'
import { getApiErrorCode } from '@/features/_common/utils/error'

const CONVERT_NOT_IN_PROGRESS_ERROR_CODE = 'INTERVIEW_CONVERTING_STATUS_IS_PENDING'
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
      retry: false,
      refetchInterval: (query) => {
        const convertStatus = query.state.data?.result?.convertStatus
        const errorCode = getApiErrorCode(query.state.error)
        if (convertStatus === 'IN_PROGRESS' || errorCode === CONVERT_IN_PROGRESS_ERROR_CODE) {
          return REFETCH_INTERVAL_MS
        }
        return false
      },
    },
  })

  const convertStatus = data?.result?.convertStatus
  const errorCode = getApiErrorCode(error)
  const isConvertingByInProgressError = errorCode === CONVERT_IN_PROGRESS_ERROR_CODE
  const isBypassByNotInProgressError = errorCode === CONVERT_NOT_IN_PROGRESS_ERROR_CODE
  const isConvertFailedByError = errorCode === CONVERT_FAILED_ERROR_CODE
  const isConvertFailedByStatus = convertStatus === 'NOT_CONVERTED'
  const isConverting = isPending || convertStatus === 'IN_PROGRESS' || isConvertingByInProgressError

  const state: ConvertGateState = (() => {
    if (isConverting) return 'loading'
    if (convertStatus === 'COMPLETED' || isBypassByNotInProgressError) return 'ready'
    if (isConvertFailedByStatus || isConvertFailedByError) return 'failed'
    if (isError) return 'error'
    return 'error'
  })()

  return {
    state,
    failureCode: isConvertFailedByError ? errorCode : isConvertFailedByStatus ? 'NOT_CONVERTED' : undefined,
    refetchConvertResult: refetch,
  }
}
