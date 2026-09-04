import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  Check,
  Image as ImageIcon,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  Video,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Switch from '../components/ui/Switch.jsx'
import Modal, { ModalHeader } from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import HelpCenterModal from '../components/profile/HelpCenterModal.jsx'
import ContactSupportModal from '../components/profile/ContactSupportModal.jsx'
import LegalLicensesModal from '../components/profile/LegalLicensesModal.jsx'
import TierUpgradeModal from '../components/profile/TierUpgradeModal.jsx'
import AddRailModal from '../components/profile/AddRailModal.jsx'
import LogoutModal from '../components/common/LogoutModal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { linkedRails } from '../data/mockData.js'

const support = [
  { title: 'Help Center', body: 'Read setup & KYC FAQs', icon: ScrollText, id: 'help' },
  { title: 'Contact Support', body: 'Get instant 24/7 help', icon: MessageCircle, id: 'support' },
  { title: 'Legal & Licenses', body: 'Terms of service', icon: Lock, id: 'legal' },
]

export default function ProfileSettings() {
  const { user, updateAvatar, logout } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [twoFa, setTwoFa] = useState(true)
  const [rails, setRails] = useState(linkedRails)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isTierUpgradeOpen, setIsTierUpgradeOpen] = useState(false)
  const [isAddRailOpen, setIsAddRailOpen] = useState(false)

  // Support modals state
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isLegalOpen, setIsLegalOpen] = useState(false)

  // Photo management state
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [facingMode, setFacingMode] = useState('user')

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)

  function toggleTwoFa(value) {
    setTwoFa(value)
    toast[value ? 'success' : 'info'](
      value ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled'
    )
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  // Handle local file upload
  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', 'Please select a valid image file (PNG, JPG, WebP).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      updateAvatar(reader.result)
      toast.success('Profile photo updated', 'Your profile picture has been changed.')
      setIsOptionsOpen(false)
    }
    reader.onerror = () => {
      toast.error('Upload failed', 'Failed to read image file.')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // Camera Management
  async function startCamera(mode = facingMode) {
    setCameraError(null)
    setCapturedPhoto(null)
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setCameraError(
        'Unable to access camera. Please verify camera permissions or upload an image file directly.'
      )
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setCapturedPhoto(null)
    setCameraError(null)
  }

  function openCameraModal() {
    setIsOptionsOpen(false)
    setIsCameraOpen(true)
    startCamera()
  }

  function closeCameraModal() {
    stopCamera()
    setIsCameraOpen(false)
  }

  function toggleCameraDirection() {
    const nextMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(nextMode)
    startCamera(nextMode)
  }

  function captureFrame() {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 640
    const ctx = canvas.getContext('2d')

    // If front camera, mirror image for natural selfie feel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedPhoto(dataUrl)
  }

  function applyCapturedPhoto() {
    if (capturedPhoto) {
      updateAvatar(capturedPhoto)
      toast.success('Profile photo updated', 'Photo captured and set as your profile picture.')
      closeCameraModal()
    }
  }

  function handleRemovePhoto() {
    updateAvatar(null)
    toast.info('Profile photo removed', 'Reverted back to default profile initials.')
    setIsOptionsOpen(false)
  }

  // Keep video source synced when stream changes
  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStream && !capturedPhoto) {
      videoRef.current.srcObject = cameraStream
    }
  }, [isCameraOpen, cameraStream, capturedPhoto])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  return (
    <DashboardLayout title="Profile & Settings">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
        <Card>
          <div className="text-center">
            {/* Avatar with Camera Overlay */}
            <div className="relative inline-block mx-auto group">
              <div
                onClick={() => setIsOptionsOpen(true)}
                className="h-28 w-28 rounded-full bg-ink-50 text-ink-700 grid place-items-center text-3xl font-bold border-2 border-ink-900 shadow-sm overflow-hidden cursor-pointer relative"
                title="Change profile picture"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1">
                  <Camera size={20} />
                  <span>Change</span>
                </div>
              </div>

              {/* Camera Trigger Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOptionsOpen(true)
                }}
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-ink-900 hover:bg-ink-800 text-white border-2 border-white shadow-md grid place-items-center transition-transform hover:scale-105 active:scale-95"
                title="Update profile picture"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-ink-900">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.phone}</p>
            <p className="text-sm text-slate-400">{user.email}</p>
            {user.kycVerified ? (
              <Badge tone="emerald" className="mt-3">
                ✓ Tier 2 KYC Verified
              </Badge>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/onboarding/kyc')}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                ⚠️ Complete KYC Verification
              </button>
            )}

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsOptionsOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700 hover:text-ink-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <Camera size={13} /> Change Photo
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Account Tier</span>
              <span className="font-bold text-ink-900">{user.tier || 'Personal Tier 2'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Daily Send Limit</span>
              <span className="font-bold text-ink-900">
                ${(user.dailySendLimit || 50000).toLocaleString()}.00
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Daily Receive Limit</span>
              <span className="font-bold text-ink-900">
                {user.dailyReceiveLimit ? `$${user.dailyReceiveLimit}` : 'Unlimited'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsTierUpgradeOpen(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>👑 Upgrade Tier / View Limits ($250k+)</span>
            </button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Security Controls"
              action={
                <Badge variant={twoFa ? 'success' : 'neutral'} size="sm">
                  {twoFa ? '2FA Enabled' : '2FA Disabled'}
                </Badge>
              }
            />
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 transition-colors ${
                    twoFa
                      ? 'bg-emerald-100 text-emerald-700 shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {twoFa ? (
                    <ShieldCheck size={20} strokeWidth={2.3} />
                  ) : (
                    <Lock size={18} strokeWidth={2.1} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink-900">
                      Two-Factor Authentication (2FA)
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Mandatory OTP via SMS / Email for transactions & transfers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={twoFa}
                  onChange={toggleTwoFa}
                  label="Toggle two-factor authentication"
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Linked Bank Accounts & Rails"
              action={
                <button
                  onClick={() => setIsAddRailOpen(true)}
                  className="flex items-center gap-1 text-sm font-semibold text-ink-800 hover:text-ink-900 cursor-pointer"
                >
                  <Plus size={15} /> Add Rail
                </button>
              }
            />
            <div className="grid sm:grid-cols-2 gap-3">
              {rails.map((rail) => (
                <div
                  key={rail.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3.5"
                >
                  <div className="h-9 w-9 rounded-full bg-ink-50 text-ink-700 grid place-items-center font-bold text-sm">
                    {rail.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{rail.name}</p>
                    <p className="text-xs text-slate-400 truncate">{rail.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Support & Resources" />
            <div className="grid sm:grid-cols-3 gap-3">
              {support.map((s) => (
                <button
                  key={s.title}
                  onClick={() => {
                    if (s.id === 'help') setIsHelpOpen(true)
                    else if (s.id === 'support') setIsSupportOpen(true)
                    else if (s.id === 'legal') setIsLegalOpen(true)
                  }}
                  className="rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors px-4 py-4 text-left"
                >
                  <s.icon size={17} className="text-ink-700 mb-2" />
                  <p className="text-sm font-semibold text-ink-900">{s.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.body}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Account Session & Logout Card */}
          <Card>
            <CardHeader title="Account Session" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
              <div>
                <p className="text-sm font-semibold text-ink-900">Sign Out of UMEPAY</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Securely terminate your current session on this device.
                </p>
              </div>
              <Button
                variant="danger"
                size="md"
                icon={LogOut}
                onClick={() => setIsLogoutModalOpen(true)}
                className="shrink-0"
              >
                Log Out
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Photo Options Modal */}
      <Modal open={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} size="sm">
        <ModalHeader title="Profile Picture" onClose={() => setIsOptionsOpen(false)} />
        <div className="p-6 space-y-3">
          <p className="text-sm text-slate-500 mb-4">
            Upload a photo from your computer or take a new picture using your camera.
          </p>

          <button
            type="button"
            onClick={openCameraModal}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-slate-200 hover:border-ink-400 hover:bg-slate-50 text-ink-900 font-semibold text-sm transition-colors text-left"
          >
            <div className="h-9 w-9 rounded-lg bg-gold-50 text-gold-600 grid place-items-center shrink-0">
              <Camera size={18} />
            </div>
            <div>
              <p className="leading-tight">Take Photo with Camera</p>
              <p className="text-xs text-slate-400 font-normal mt-0.5">Use your webcam or phone camera</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-slate-200 hover:border-ink-400 hover:bg-slate-50 text-ink-900 font-semibold text-sm transition-colors text-left"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 grid place-items-center shrink-0">
              <Upload size={18} />
            </div>
            <div>
              <p className="leading-tight">Upload Image File</p>
              <p className="text-xs text-slate-400 font-normal mt-0.5">PNG, JPG, or WebP format</p>
            </div>
          </button>

          {user.avatar && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-600 font-semibold text-sm transition-colors text-left"
            >
              <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 grid place-items-center shrink-0">
                <Trash2 size={18} />
              </div>
              <div>
                <p className="leading-tight">Remove Photo</p>
                <p className="text-xs text-rose-400 font-normal mt-0.5">Revert to initials</p>
              </div>
            </button>
          )}
        </div>
      </Modal>

      {/* Live Camera Viewfinder Modal */}
      <Modal open={isCameraOpen} onClose={closeCameraModal} size="md">
        <ModalHeader title="Take Profile Picture" onClose={closeCameraModal} />
        <div className="p-6">
          {cameraError ? (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 grid place-items-center mx-auto mb-3">
                <Video size={24} />
              </div>
              <p className="text-sm text-slate-700 font-semibold">{cameraError}</p>
              <Button
                className="mt-5"
                onClick={() => {
                  closeCameraModal()
                  fileInputRef.current?.click()
                }}
                icon={Upload}
              >
                Upload File Instead
              </Button>
            </div>
          ) : (
            <div>
              <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl bg-ink-950 overflow-hidden flex items-center justify-center">
                {capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="Captured preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`h-full w-full object-cover ${
                        facingMode === 'user' ? '-scale-x-100' : ''
                      }`}
                    />
                    {/* Framing guide overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="h-56 w-56 sm:h-64 sm:w-64 rounded-full border-2 border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                {capturedPhoto ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => setCapturedPhoto(null)}
                      icon={RefreshCw}
                    >
                      Retake
                    </Button>
                    <Button onClick={applyCapturedPhoto} icon={Check}>
                      Save Profile Picture
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={toggleCameraDirection}
                      icon={RefreshCw}
                      title="Flip camera"
                    >
                      Flip
                    </Button>
                    <Button
                      size="lg"
                      onClick={captureFrame}
                      icon={Camera}
                      className="px-6 shadow-md"
                    >
                      Capture Photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        closeCameraModal()
                        fileInputRef.current?.click()
                      }}
                      icon={Upload}
                    >
                      Upload
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <LogoutModal open={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />

      {/* Support, Upgrade & Rail Modals */}
      <HelpCenterModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ContactSupportModal open={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <LegalLicensesModal open={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
      <TierUpgradeModal open={isTierUpgradeOpen} onClose={() => setIsTierUpgradeOpen(false)} />
      <AddRailModal
        open={isAddRailOpen}
        onClose={() => setIsAddRailOpen(false)}
        onRailAdded={(newRail) => setRails((prev) => [...prev, newRail])}
      />
    </DashboardLayout>
  )
}
