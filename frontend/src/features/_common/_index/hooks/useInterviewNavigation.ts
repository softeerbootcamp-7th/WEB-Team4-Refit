import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'

export function useInterviewNavigate() {
  const navigate = useNavigate()
  const { interviewId } = useParams()

  return useCallback(
    (route: string, options?: { replace?: boolean }) => {
      if (!interviewId) return
      navigate(route.replace(':interviewId', interviewId), options)
    },
    [navigate, interviewId],
  )
}
