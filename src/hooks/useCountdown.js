import { useEffect, useRef, useState } from 'react'

export default function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  function reset(next = initialSeconds) {
    setSeconds(next)
  }

  const label = `0:${String(seconds).padStart(2, '0')}`

  return { seconds, label, reset }
}
