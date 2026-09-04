import { useState, useEffect } from 'react'
import { Camera, CheckCircle2, QrCode, Sparkles, Upload, X, Zap } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function QrScannerModal({ open, onClose, onScanSuccess, asset = 'USDT' }) {
  const toast = useToast()
  const [scanning, setScanning] = useState(true)
  const [scannedData, setScannedData] = useState(null)

  useEffect(() => {
    if (open) {
      setScanning(true)
      setScannedData(null)
    }
  }, [open])

  function handleSimulateScan(sampleAddress, sampleName = '') {
    setScanning(false)
    setScannedData({ address: sampleAddress, name: sampleName })
    toast.success('QR Code Detected', `Resolved: ${sampleAddress.slice(0, 12)}...`)
    setTimeout(() => {
      onScanSuccess(sampleAddress, sampleName)
      onClose()
    }, 600)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      toast.info('Analyzing QR Image', 'Extracting recipient wallet address...')
      setTimeout(() => {
        handleSimulateScan('0x71C8657daB7926862a610e4b854378A8696F1F9e', 'Universal Payee')
      }, 700)
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Scan Recipient QR Code" onClose={onClose} />
      <div className="p-6 text-center space-y-4">
        {/* Scanner Viewport */}
        <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl bg-slate-950 overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
          {/* Ambient Video Simulation Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Glowing Corner Guides */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

          {/* Animated Laser Scanning Line */}
          {scanning && (
            <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce duration-1000" />
          )}

          {/* Center Target Box */}
          <div className="relative z-10 flex flex-col items-center justify-center p-4">
            {scannedData ? (
              <div className="flex flex-col items-center animate-in zoom-in-75 duration-200">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <CheckCircle2 size={36} strokeWidth={2.5} />
                </div>
                <p className="text-white text-xs font-bold font-mono truncate max-w-[200px]">
                  {scannedData.address}
                </p>
              </div>
            ) : (
              <>
                <QrCode size={64} className="text-slate-600 mb-2 animate-pulse" />
                <p className="text-[11px] font-semibold text-slate-400 tracking-wide">
                  Align QR Code inside frame
                </p>
              </>
            )}
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-2 text-left pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Or Click to Auto-Detect Sample Address
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleSimulateScan(
                  '0x71C8657daB7926862a610e4b854378A8696F1F9e',
                  'EVM Multi-Chain'
                )
              }
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-900">
                <Zap size={13} className="text-blue-600" /> ERC-20 / ETH
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">0x71C8657d...1F9e</p>
            </button>

            <button
              type="button"
              onClick={() =>
                handleSimulateScan(
                  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                  'Bitcoin SegWit'
                )
              }
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-900">
                <Zap size={13} className="text-amber-500" /> BTC SegWit
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">bc1qxy2kgd...0wlh</p>
            </button>
          </div>
        </div>

        {/* Upload Image Option */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
          <label className="inline-flex items-center gap-2 text-xs font-bold text-ink-800 hover:text-black cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors">
            <Upload size={14} />
            <span>Upload QR Image from Device</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
    </Modal>
  )
}
