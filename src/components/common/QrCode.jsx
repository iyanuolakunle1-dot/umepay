import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { generateQrMatrix } from '../../utils/qrcode.js'

export default function QrCode({
  value = 'umepay:+2348123456789',
  size = 220,
  logo = true,
  className = '',
  bgColor = '#FFFFFF',
  fgColor = '#0F1230',
}) {
  const canvasRef = useRef(null)
  const [svgMatrix, setSvgMatrix] = useState(null)
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    // Generate standard QR code via qrcode package
    if (QRCode && QRCode.toCanvas) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1.5,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: 'M',
        },
        (err) => {
          if (!err && canvasRef.current) {
            setDataUrl(canvasRef.current.toDataURL('image/png'))
          } else {
            // Fallback to internal matrix generator
            try {
              const matrix = generateQrMatrix(value)
              setSvgMatrix(matrix)
            } catch (e) {
              console.error(e)
            }
          }
        }
      )
    } else {
      try {
        const matrix = generateQrMatrix(value)
        setSvgMatrix(matrix)
      } catch (e) {
        console.error(e)
      }
    }
  }, [value, size, bgColor, fgColor])

  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-slate-100 ${className}`}
      style={{ width: size + 24, height: size + 24 }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-xl block"
        style={{ width: size, height: size }}
      />

      {/* SVG Fallback if canvas is not rendered yet */}
      {svgMatrix && !dataUrl && (
        <svg
          viewBox={`0 0 ${svgMatrix.length} ${svgMatrix.length}`}
          className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] rounded-xl"
          shapeRendering="crispEdges"
        >
          <rect width="100%" height="100%" fill={bgColor} />
          {svgMatrix.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width="1"
                  height="1"
                  fill={fgColor}
                />
              ) : null
            )
          )}
        </svg>
      )}

      {/* Center UMEPAY Badge */}
      {logo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-9 w-9 rounded-lg bg-white p-0.5 shadow-md flex items-center justify-center">
            <div className="h-full w-full rounded-md bg-[#0F1230] text-white flex items-center justify-center font-black text-xs tracking-tighter">
              U
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
