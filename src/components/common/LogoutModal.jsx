import { useNavigate } from 'react-router-dom'
import { LogOut, ShieldAlert } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function LogoutModal({ open, onClose }) {
  const { logout } = useApp()
  const toast = useToast()
  const navigate = useNavigate()

  function handleConfirmLogout() {
    onClose()
    logout()
    toast.info('Signed Out', 'You have been securely signed out.')
    navigate('/')
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Sign Out" onClose={onClose} />
      <div className="p-6 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <LogOut size={28} strokeWidth={2.3} />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-ink-900">Sign out of your account?</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            You will need your phone number and security PIN to access your Universal Financial ID again.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={handleConfirmLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </Modal>
  )
}
