import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'

export function useInterviewNavigate() {
  const navigate = useNavigate()
  const { interviewId } = useParams()

  return useCallback(
    (route: string) => {
      if (!interviewId) return
      navigate(route.replace(':interviewId', interviewId))
    },
    [navigate, interviewId],
  )
}
