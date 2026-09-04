import { createContext, useCallback, useContext, useRef, useState } from 'react'
import ToastViewport from '../components/ui/Toast.jsx'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(
    ({ title, description, variant = 'default', duration = 3800 }) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, title, description, variant }])
      timers.current[id] = setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss]
  )

  const toast = {
    show: showToast,
    success: (title, description) => showToast({ title, description, variant: 'success' }),
    error: (title, description) => showToast({ title, description, variant: 'error' }),
    info: (title, description) => showToast({ title, description, variant: 'info' }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
