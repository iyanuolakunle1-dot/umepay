import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  FileText,
  RefreshCw,
  Upload,
  Video,
  X,
} from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import Modal, { ModalHeader } from '../../components/ui/Modal.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function KycVerification() {
  const navigate = useNavigate()
  const toast = useToast()
  const { updateUser } = useApp()

  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Alexander Cooper',
    dob: '12/04/1995',
    nationality: 'Nigeria (NG)',
    gender: 'Male',
    address: '82 Orchard Street, Suite 4B',
    city: 'Lagos',
    state: 'Lagos State',
    postalCode: '100011',
  })

  // Step 2: Document Upload State
  const [documentType, setDocumentType] = useState('National Identity Number')
  const [idNumber, setIdNumber] = useState('0123456789')
  const [frontDoc, setFrontDoc] = useState({
    name: 'passport_front.jpg',
    size: '2.3 MB',
    dataUrl: null,
  })
  const [backDoc, setBackDoc] = useState({
    name: 'passport_back.jpg',
    size: '1.8 MB',
    dataUrl: null,
  })

  const frontInputRef = useRef(null)
  const backInputRef = useRef(null)
  const selfieInputRef = useRef(null)

  // Step 3: Selfie Verification State
  const [selfiePhoto, setSelfiePhoto] = useState(null)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [capturedFrame, setCapturedFrame] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [facingMode, setFacingMode] = useState('user')
  const [submitting, setSubmitting] = useState(false)
  const [kycSuccess, setKycSuccess] = useState(false)

  const videoRef = useRef(null)

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    } else {
      navigate(-1)
    }
  }

  // Step 1 Submit
  function handleStep1Submit(e) {
    e?.preventDefault()
    if (!personalInfo.fullName.trim()) {
      toast.error('Required Field', 'Please enter your full legal name.')
      return
    }
    setCurrentStep(2)
  }

  // Step 2 File Handling
  function handleFileUpload(file, isFront = true) {
    if (!file) return
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    const reader = new FileReader()
    reader.onload = () => {
      const docData = {
        name: file.name,
        size: formattedSize,
        dataUrl: reader.result,
      }
      if (isFront) setFrontDoc(docData)
      else setBackDoc(docData)
      toast.success('File attached', `${file.name} ready for verification.`)
    }
    reader.readAsDataURL(file)
  }

  function handleStep2Submit(e) {
    e?.preventDefault()
    if (!frontDoc) {
      toast.error('Document Required', 'Please upload at least the front of your document.')
      return
    }
    setCurrentStep(3)
  }

  // Step 3 Camera Management
  async function startCamera(mode = facingMode) {
    setCameraError(null)
    setCapturedFrame(null)
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
      console.error('Camera error:', err)
      setCameraError('Unable to access camera. Please allow camera permissions or upload a photo instead.')
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setCapturedFrame(null)
  }

  function openCamera() {
    setIsCameraModalOpen(true)
    startCamera()
  }

  function closeCamera() {
    stopCamera()
    setIsCameraModalOpen(false)
  }

  function toggleCameraFlip() {
    const nextMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(nextMode)
    startCamera(nextMode)
  }

  function snapSelfie() {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 640
    const ctx = canvas.getContext('2d')

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedFrame(dataUrl)
  }

  function applySelfie() {
    if (capturedFrame) {
      setSelfiePhoto(capturedFrame)
      closeCamera()
      toast.success('Selfie Captured', 'Face photo recorded for verification.')
    }
  }

  function handleSelfieFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setSelfiePhoto(reader.result)
      toast.success('Selfie Uploaded', 'Photo selected for identity verification.')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleFinalSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setKycSuccess(true)
      updateUser({
        name: personalInfo.fullName,
        kycVerified: true,
        avatar: selfiePhoto || undefined,
      })
      toast.success('Verification Complete', 'Your identity has been verified successfully.')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    }, 1200)
  }

  useEffect(() => {
    if (isCameraModalOpen && videoRef.current && cameraStream && !capturedFrame) {
      videoRef.current.srcObject = cameraStream
    }
  }, [isCameraModalOpen, cameraStream, capturedFrame])

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [cameraStream])

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-14 px-4 flex items-center justify-center">
      {/* Hidden File Inputs */}
      <input
        ref={frontInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => handleFileUpload(e.target.files?.[0], true)}
        className="hidden"
      />
      <input
        ref={backInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => handleFileUpload(e.target.files?.[0], false)}
        className="hidden"
      />
      <input
        ref={selfieInputRef}
        type="file"
        accept="image/*"
        onChange={handleSelfieFileSelect}
        className="hidden"
      />

      <div className="w-full max-w-[800px] bg-white rounded-3xl sm:rounded-[32px] shadow-sm border border-slate-200/80 p-6 sm:p-12 animate-fade-in">
        {/* Navigation & Step Pill */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </button>

          <span className="inline-flex items-center bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            STEP {currentStep} OF 3
          </span>
        </div>

        {/* 3-Step Stepper Progress Header */}
        <div className="flex items-center justify-between mb-10 gap-2 sm:gap-3">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {currentStep > 1 ? (
              <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-500 text-emerald-500 flex items-center justify-center shrink-0">
                <Check size={16} strokeWidth={3} />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#18224b] text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
            )}
            <div className="leading-tight truncate">
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                STEP 1 {currentStep === 1 ? '(ACTIVE)' : ''}
              </p>
              <p className={`text-xs sm:text-sm font-semibold ${currentStep === 1 ? 'text-slate-900' : 'text-slate-600'}`}>
                Personal Info
              </p>
            </div>
          </div>

          {/* Line 1 */}
          <div className={`h-[2px] flex-1 min-w-[20px] sm:min-w-[40px] rounded-full transition-colors ${currentStep > 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {currentStep > 2 ? (
              <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-500 text-emerald-500 flex items-center justify-center shrink-0">
                <Check size={16} strokeWidth={3} />
              </div>
            ) : currentStep === 2 ? (
              <div className="h-8 w-8 rounded-full bg-[#18224b] text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-sm font-semibold shrink-0">
                2
              </div>
            )}
            <div className="leading-tight truncate">
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                STEP 2 {currentStep === 2 ? '(ACTIVE)' : ''}
              </p>
              <p className={`text-xs sm:text-sm font-semibold ${currentStep === 2 ? 'text-slate-900' : 'text-slate-500'}`}>
                Document Upload
              </p>
            </div>
          </div>

          {/* Line 2 */}
          <div className={`h-[2px] flex-1 min-w-[20px] sm:min-w-[40px] rounded-full transition-colors ${currentStep > 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {currentStep === 3 ? (
              <div className="h-8 w-8 rounded-full bg-[#18224b] text-white flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-sm font-semibold shrink-0">
                3
              </div>
            )}
            <div className="leading-tight truncate">
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                STEP 3 {currentStep === 3 ? '(ACTIVE)' : ''}
              </p>
              <p className={`text-xs sm:text-sm font-semibold ${currentStep === 3 ? 'text-slate-900' : 'text-slate-500'}`}>
                Selfie Verification
              </p>
            </div>
          </div>
        </div>

        {/* STEP 1: Personal Information Form */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Personal Information
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Tell us about yourself to verify your identity.
            </p>

            <form onSubmit={handleStep1Submit} className="mt-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Full Legal Name (as shown on ID)
                  </label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={personalInfo.dob}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                      placeholder="DD/MM/YYYY"
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-11 text-sm text-slate-900 outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 transition-colors"
                    />
                    <Calendar size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Nationality
                  </label>
                  <div className="relative">
                    <select
                      value={personalInfo.nationality}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-10 text-sm text-slate-900 bg-white outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 appearance-none transition-colors"
                    >
                      <option value="Nigeria (NG)">Nigeria (NG)</option>
                      <option value="United States (US)">United States (US)</option>
                      <option value="United Kingdom (GB)">United Kingdom (GB)</option>
                      <option value="Canada (CA)">Canada (CA)</option>
                      <option value="Ghana (GH)">Ghana (GH)</option>
                      <option value="Kenya (KE)">Kenya (KE)</option>
                      <option value="South Africa (ZA)">South Africa (ZA)</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-10 text-sm text-slate-900 bg-white outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 appearance-none transition-colors"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                  placeholder="Street address"
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                    placeholder="City"
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    State / Province
                  </label>
                  <div className="relative">
                    <select
                      value={personalInfo.state}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-10 text-sm text-slate-900 bg-white outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 appearance-none transition-colors"
                    >
                      <option value="Lagos State">Lagos State</option>
                      <option value="Abuja FCT">Abuja FCT</option>
                      <option value="Rivers State">Rivers State</option>
                      <option value="Oyo State">Oyo State</option>
                      <option value="Kano State">Kano State</option>
                      <option value="Enugu State">Enugu State</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={personalInfo.postalCode}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, postalCode: e.target.value })}
                    placeholder="Postal Code"
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-[#18224b] hover:bg-[#111936] text-white py-4 rounded-xl font-bold text-[15px] sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <span>Continue to Document Upload</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Document Upload */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Document Upload
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Upload a valid government-issued ID to verify your identity.
            </p>

            <form onSubmit={handleStep2Submit} className="mt-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Means of Identification
                  </label>
                  <div className="relative">
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 pr-10 text-sm text-slate-900 bg-white outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 appearance-none transition-colors"
                    >
                      <option value="National Identity Number">National Identity Number</option>
                      <option value="International Passport">International Passport</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Voter's Card">Voter's Card</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Identification Number
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter ID number"
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-[#18224b] focus:ring-2 focus:ring-[#18224b]/10 transition-colors"
                  />
                </div>
              </div>

              {/* Upload Dropzones */}
              <div className="grid sm:grid-cols-2 gap-5 pt-2">
                {/* Front of Document */}
                <div
                  className={`rounded-2xl border-2 border-dashed transition-all p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[200px] ${
                    frontDoc
                      ? 'border-[#0284c7]/40 bg-[#f0f9ff]/40'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {frontDoc ? (
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-3 shadow-xs">
                        <FileText size={22} />
                      </div>
                      <p className="font-bold text-sm text-slate-900 break-all max-w-[220px]">
                        {frontDoc.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{frontDoc.size}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-500/60 px-2.5 py-0.5 rounded-md">
                          ✓ READY
                        </span>
                        <button
                          type="button"
                          onClick={() => setFrontDoc(null)}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="h-10 w-10 mx-auto mb-2 text-slate-600 flex items-center justify-center">
                        <Upload size={28} />
                      </div>
                      <p className="font-bold text-sm text-slate-900">Front of Document</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Drag & drop file or{' '}
                        <button
                          type="button"
                          onClick={() => frontInputRef.current?.click()}
                          className="underline font-semibold text-slate-900 hover:text-black"
                        >
                          Browse Files
                        </button>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Supported: JPG, PNG, PDF • Max 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Back of Document */}
                <div
                  className={`rounded-2xl border-2 border-dashed transition-all p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[200px] ${
                    backDoc
                      ? 'border-[#0284c7]/40 bg-[#f0f9ff]/40'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {backDoc ? (
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-3 shadow-xs">
                        <FileText size={22} />
                      </div>
                      <p className="font-bold text-sm text-slate-900 break-all max-w-[220px]">
                        {backDoc.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{backDoc.size}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-500/60 px-2.5 py-0.5 rounded-md">
                          ✓ READY
                        </span>
                        <button
                          type="button"
                          onClick={() => setBackDoc(null)}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="h-10 w-10 mx-auto mb-2 text-slate-600 flex items-center justify-center">
                        <Upload size={28} />
                      </div>
                      <p className="font-bold text-sm text-slate-900">Back of Document (Optional)</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Drag & drop file or{' '}
                        <button
                          type="button"
                          onClick={() => backInputRef.current?.click()}
                          className="underline font-semibold text-slate-900 hover:text-black"
                        >
                          Browse Files
                        </button>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Supported: JPG, PNG, PDF • Max 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {frontDoc && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 animate-fade-in">
                  <Check size={16} strokeWidth={3} />
                  <span>Files uploaded successfully</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!frontDoc}
                className="w-full mt-8 bg-[#18224b] hover:bg-[#111936] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-[15px] sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <span>Upload &amp; Continue</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Selfie Verification */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Selfie Verification
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Take a live photo to confirm your identity matches your documents.
            </p>

            {/* Circular Camera Framing Area */}
            <div className="my-8 flex justify-center">
              <div className="h-56 w-56 sm:h-64 sm:w-64 rounded-full border-2 border-dashed border-slate-400 bg-slate-50/70 flex flex-col items-center justify-center p-4 text-center overflow-hidden relative shadow-inner">
                {selfiePhoto ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selfiePhoto}
                      alt="Selfie verification"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-full flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={openCamera}
                        className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full"
                      >
                        Retake Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera size={38} className="text-slate-800 stroke-[1.8] mb-2" />
                    <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-[145px] leading-snug">
                      Position your face within the frame
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="max-w-md mx-auto space-y-2 text-xs sm:text-sm text-slate-600 mb-8 pl-6 sm:pl-10">
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Ensure your environment has good lighting
              </p>
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Remove glasses, hats, or face coverings
              </p>
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Hold your device steady at eye level
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {selfiePhoto ? (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="w-full bg-[#18224b] hover:bg-[#111936] text-white py-4 rounded-xl font-bold text-[15px] sm:text-base flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99]"
                >
                  <Check size={18} strokeWidth={3} />
                  <span>{submitting ? 'Verifying Identity...' : 'Confirm & Complete KYC'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCamera}
                  className="w-full bg-[#18224b] hover:bg-[#111936] text-white py-4 rounded-xl font-bold text-[15px] sm:text-base flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99]"
                >
                  <Camera size={19} />
                  <span>Use Camera</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => selfieInputRef.current?.click()}
                className="w-full text-center text-sm font-semibold text-slate-600 hover:text-slate-900 underline py-2 block"
              >
                Upload Photo Instead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Camera Viewfinder Modal */}
      <Modal open={isCameraModalOpen} onClose={closeCamera} size="md">
        <ModalHeader title="Take Live Selfie" onClose={closeCamera} />
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
                  closeCamera()
                  selfieInputRef.current?.click()
                }}
                icon={Upload}
              >
                Upload Photo File Instead
              </Button>
            </div>
          ) : (
            <div>
              <div className="relative aspect-square rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center">
                {capturedFrame ? (
                  <img
                    src={capturedFrame}
                    alt="Captured selfie preview"
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
                    {/* Framing oval guide */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="h-64 w-52 sm:h-72 sm:w-60 rounded-full border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                {capturedFrame ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => setCapturedFrame(null)}
                      icon={RefreshCw}
                    >
                      Retake
                    </Button>
                    <Button onClick={applySelfie} icon={Check}>
                      Use This Photo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={toggleCameraFlip}
                      icon={RefreshCw}
                    >
                      Flip
                    </Button>
                    <Button
                      size="lg"
                      onClick={snapSelfie}
                      icon={Camera}
                      className="px-6 shadow-md"
                    >
                      Snap Photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        closeCamera()
                        selfieInputRef.current?.click()
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
    </div>
  )
}
