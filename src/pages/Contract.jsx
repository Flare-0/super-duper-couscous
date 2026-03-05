import { useState, useEffect, useRef, useCallback } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import * as pdfjsLib from 'pdfjs-dist'
import contractPdfUrl from '../assets/Contract-mattr.pdf'
import dmSansFontUrl from '../fonts/DMSans-VariableFont_opsz,wght.ttf'
import './Contract.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString()

/*
  PDF coordinate reference (origin = bottom-left, A4 = 595.276 × 841.89 pt)
  
  Font: DM Sans variable (optical size 9pt instance in original)
  Effective render size: 13.6pt via pdf-lib (matches 17pt text matrix × narrower optical variant)
  
  Baselines & X positions measured from the original PDF streams:
  
  PAGE 1:
    Y=663.7  "This Agreement is entered into as of [Date] by and between [Your "
             [Date] at x≈262, [Your at x≈411
    Y=643.3  "Name/Studio Name] ("Designer") and [Client Name] ("Client"). Both "
             Name/Studio at x≈27, [Client Name] at x≈265
    Y=387.6  "Total Project Fee: $[Amount]"
             $[Amount] at x≈139
    Y=367.2  "Deposit: ... 50% ($[Amount])"
             ($[Amount]) at x≈378
    Y=326.3  "Final Payment: ... 50% ($[Amount]) ..."
             ($[Amount]) at x≈245
    Y=174.3  "Client is entitled to [Number] rounds..."
             [Number] at x≈150
  
  PAGE 3:
    Y=251.1  "...governed by the laws of [Your State/Coun"
             [Your State/Coun at x≈338
    Y=230.7  "try]. Any legal..."
             try] at x≈27
*/

const FONT_SIZE = 13.6
const TEXT_COLOR = rgb(0.13, 0.21, 0.33) // matches original dark text
const COVER_COLOR = rgb(1, 1, 1) // white cover rectangles

const PLACEHOLDERS = [
    {
        id: 'date',
        label: 'Agreement Date',
        placeholder: 'e.g. February 21, 2026',
        covers: [{ page: 0, x: 258, y: 660, w: 45, h: 18 }],
        draw: { page: 0, x: 260, y: 663.7 },
    },
    {
        id: 'designerName',
        label: 'Your Name / Studio Name',
        placeholder: 'e.g. Mattr Studio',
        covers: [
            { page: 0, x: 407, y: 660, w: 165, h: 18 },
            { page: 0, x: 27, y: 639, w: 163, h: 18 },
        ],
        draw: { page: 0, x: 409, y: 663.7 },
    },
    {
        id: 'clientName',
        label: 'Client Name',
        placeholder: 'e.g. John Doe',
        covers: [{ page: 0, x: 260, y: 639, w: 92, h: 18 }],
        draw: { page: 0, x: 262, y: 643.3 },
    },
    {
        id: 'totalFee',
        label: 'Total Project Fee ($)',
        placeholder: 'e.g. 2,000',
        covers: [{ page: 0, x: 137, y: 383, w: 72, h: 18 }],
        draw: { page: 0, x: 139, y: 387.6 },
        prefix: '$',
    },
    {
        id: 'depositAmount',
        label: 'Deposit Amount (50%) ($)',
        placeholder: 'e.g. 1,000',
        covers: [{ page: 0, x: 375, y: 363, w: 85, h: 18 }],
        draw: { page: 0, x: 377, y: 367.2 },
        prefix: '($',
        suffix: ')',
    },
    {
        id: 'finalAmount',
        label: 'Final Payment Amount (50%) ($)',
        placeholder: 'e.g. 1,000',
        covers: [{ page: 0, x: 243, y: 322, w: 85, h: 18 }],
        draw: { page: 0, x: 245, y: 326.3 },
        prefix: '($',
        suffix: ')',
    },
    {
        id: 'revisionRounds',
        label: 'Number of Revision Rounds',
        placeholder: 'e.g. 2',
        covers: [{ page: 0, x: 148, y: 170, w: 65, h: 18 }],
        draw: { page: 0, x: 150, y: 174.3 },
    },
    {
        id: 'jurisdiction',
        label: 'State / Country (Governing Law)',
        placeholder: 'e.g. New York, USA',
        covers: [
            { page: 2, x: 336, y: 247, w: 170, h: 18 },
            { page: 2, x: 27, y: 227, w: 40, h: 18 },
        ],
        draw: { page: 2, x: 338, y: 251.1 },
    },
]

export default function Contract() {
    const [formData, setFormData] = useState(() => {
        const initial = {}
        PLACEHOLDERS.forEach((p) => (initial[p.id] = ''))
        return initial
    })
    const [pageImages, setPageImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const pdfBytesRef = useRef(null)
    const fontBytesRef = useRef(null)

    useEffect(() => {
        async function init() {
            try {
                const [pdfResp, fontResp] = await Promise.all([
                    fetch(contractPdfUrl),
                    fetch(dmSansFontUrl),
                ])
                const [pdfBuf, fontBuf] = await Promise.all([
                    pdfResp.arrayBuffer(),
                    fontResp.arrayBuffer(),
                ])
                pdfBytesRef.current = new Uint8Array(pdfBuf)
                fontBytesRef.current = new Uint8Array(fontBuf)

                // Render preview images
                const pdf = await pdfjsLib.getDocument({ data: pdfBuf.slice(0) }).promise
                const images = []
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i)
                    const scale = 1.5
                    const viewport = page.getViewport({ scale })
                    const canvas = document.createElement('canvas')
                    canvas.width = viewport.width
                    canvas.height = viewport.height
                    const ctx = canvas.getContext('2d')
                    await page.render({ canvasContext: ctx, viewport }).promise
                    images.push(canvas.toDataURL('image/png'))
                }
                setPageImages(images)
            } catch (err) {
                console.error('Failed to load resources:', err)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    const handleChange = useCallback((id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }))
    }, [])

    const generatePdf = useCallback(async () => {
        if (!pdfBytesRef.current || !fontBytesRef.current) return
        setGenerating(true)

        try {
            const pdfDoc = await PDFDocument.load(pdfBytesRef.current)
            pdfDoc.registerFontkit(fontkit)
            const dmSans = await pdfDoc.embedFont(fontBytesRef.current)

            for (const placeholder of PLACEHOLDERS) {
                const value = formData[placeholder.id]
                if (!value) continue

                // White-out cover rectangles
                for (const cover of placeholder.covers) {
                    const page = pdfDoc.getPage(cover.page)
                    page.drawRectangle({
                        x: cover.x,
                        y: cover.y,
                        width: cover.w,
                        height: cover.h,
                        color: COVER_COLOR,
                        borderWidth: 0,
                    })
                }

                // Draw replacement text
                const drawPage = pdfDoc.getPage(placeholder.draw.page)
                let drawText = value
                if (placeholder.prefix) drawText = placeholder.prefix + drawText
                if (placeholder.suffix) drawText = drawText + placeholder.suffix

                drawPage.drawText(drawText, {
                    x: placeholder.draw.x,
                    y: placeholder.draw.y,
                    size: FONT_SIZE,
                    font: dmSans,
                    color: TEXT_COLOR,
                })
            }

            const modifiedPdfBytes = await pdfDoc.save()
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const clientName = formData.clientName || 'Client'
            const safeName = clientName.replace(/[^a-zA-Z0-9]/g, '_')
            a.download = `Mattr_Contract_${safeName}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('PDF generation failed:', err)
        } finally {
            setGenerating(false)
        }
    }, [formData])

    const isFormValid = PLACEHOLDERS.every((p) => formData[p.id].trim() !== '')

    return (
        <div className="contract-page">
            <div className="contract-layout">
                {/* ── Left: Form Panel ── */}
                <aside className="contract-form-panel">
                    <div className="form-header">
                        <span className="form-badge">Contract Generator</span>
                        <h1>Fill in Contract Details</h1>
                        <p>
                            Complete the fields below to populate your Motion Design Service
                            Agreement. Once ready, download the finished PDF.
                        </p>
                    </div>

                    <form
                        className="contract-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            generatePdf()
                        }}
                    >
                        {PLACEHOLDERS.map((p) => (
                            <div className="form-group" key={p.id}>
                                <label htmlFor={p.id}>{p.label}</label>
                                <input
                                    id={p.id}
                                    type="text"
                                    placeholder={p.placeholder}
                                    value={formData[p.id]}
                                    onChange={(e) => handleChange(p.id, e.target.value)}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="download-btn"
                            disabled={!isFormValid || generating}
                        >
                            {generating ? (
                                <>
                                    <span className="spinner" />
                                    Generating…
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Download PDF
                                </>
                            )}
                        </button>
                    </form>
                </aside>

                {/* ── Right: PDF Preview ── */}
                <section className="contract-preview-panel">
                    <div className="preview-header">
                        <h2>Contract Preview</h2>
                        <span className="preview-badge">Original Template</span>
                    </div>

                    <div className="preview-scroll">
                        {loading ? (
                            <div className="preview-loading">
                                <span className="spinner large" />
                                <p>Loading contract template…</p>
                            </div>
                        ) : (
                            pageImages.map((src, i) => (
                                <div className="preview-page" key={i}>
                                    <span className="page-number">Page {i + 1}</span>
                                    <img
                                        src={src}
                                        alt={`Contract page ${i + 1}`}
                                        draggable={false}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
