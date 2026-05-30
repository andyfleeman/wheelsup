import { useState, useRef } from 'react'
import { fromMiles, toMiles } from '../utils/units'
import './FuelLogModal.css'

async function parseWithGemini(parts) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return null
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] }),
  })
  if (!res.ok) return null
  const data = await res.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!raw) return null
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  return JSON.parse(cleaned)
}

const FUEL_PROMPT = `Extract fuel fill-up data. Return ONLY valid JSON with these fields (use null for anything not found):
{"gallons": number, "pricePerUnit": number, "totalCost": number, "mileage": number}
Do not include any other text.`

export default function FuelLogModal({ currentMileage, useMetric, onSave, onClose }) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate]             = useState(today)
  const [mileage, setMileage]       = useState(fromMiles(currentMileage, useMetric))
  const [gallons, setGallons]       = useState('')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [totalCost, setTotalCost]   = useState('')
  const [fullTank, setFullTank]     = useState(true)
  const [notes, setNotes]           = useState('')
  const [saving, setSaving]         = useState(false)
  const [scanning, setScanning]     = useState(false)
  const [listening, setListening]   = useState(false)
  const [scanMsg, setScanMsg]       = useState('')
  const photoRef = useRef(null)
  const recognitionRef = useRef(null)

  const unit = useMetric ? 'L' : 'gal'
  const computedCost = gallons && pricePerUnit
    ? (parseFloat(gallons) * parseFloat(pricePerUnit)).toFixed(2)
    : ''
  const displayCost = totalCost || computedCost
  const canSave = date && mileage && gallons && parseFloat(gallons) > 0

  const applyParsed = (result) => {
    if (!result) { setScanMsg('Could not read — try again.'); return }
    if (result.gallons)      setGallons(String(result.gallons))
    if (result.pricePerUnit) { setPricePerUnit(String(result.pricePerUnit)); setTotalCost('') }
    if (result.totalCost)    { setTotalCost(String(result.totalCost)); setPricePerUnit('') }
    if (result.mileage)      setMileage(fromMiles(result.mileage, useMetric))
    setScanMsg('')
  }

  const handleScanPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setScanning(true)
    setScanMsg('Reading pump screen…')
    try {
      const reader = new FileReader()
      const base64 = await new Promise((res, rej) => {
        reader.onload = () => res(reader.result.split(',')[1])
        reader.onerror = rej
        reader.readAsDataURL(file)
      })
      const result = await parseWithGemini([
        { inlineData: { mimeType: file.type || 'image/jpeg', data: base64 } },
        { text: FUEL_PROMPT },
      ])
      applyParsed(result)
    } catch {
      setScanMsg('Could not read pump — enter manually.')
    } finally {
      setScanning(false)
    }
  }

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setScanMsg('Voice not supported on this device'); return }
    if (!import.meta.env.VITE_GEMINI_API_KEY) { setScanMsg('Gemini API key required'); return }

    if (listening) {
      recognitionRef.current?.abort()
      setListening(false)
      return
    }

    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    recognitionRef.current = rec

    rec.onstart = () => { setListening(true); setScanMsg('Listening…') }
    rec.onend   = () => { setListening(false) }

    rec.onresult = async (ev) => {
      const transcript = ev.results[0][0].transcript
      setScanMsg('Parsing…')
      try {
        const result = await parseWithGemini([{
          text: `${FUEL_PROMPT}\n\nUser said: "${transcript}"`,
        }])
        applyParsed(result)
      } catch {
        setScanMsg('Could not parse — try again.')
      }
    }

    rec.onerror = () => { setListening(false); setScanMsg('Voice error — try again.') }
    rec.start()
  }

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    const costVal = totalCost
      ? parseFloat(parseFloat(totalCost).toFixed(2))
      : computedCost ? parseFloat(parseFloat(computedCost).toFixed(2)) : null
    await onSave({
      date,
      mileage:      toMiles(Number(mileage), useMetric),
      gallons:      parseFloat(gallons),
      pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : null,
      totalCost:    costVal,
      fullTank,
      notes:        notes.trim() || null,
      useMetric,
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <h3>Log Fill-Up</h3>
          <div className="fuel-quick-actions">
            <button
              className={`fuel-quick-btn${scanning ? ' fuel-quick-btn--active' : ''}`}
              onClick={() => photoRef.current?.click()}
              disabled={scanning || listening}
              title="Scan pump screen"
            >
              {scanning ? '…' : '📷'} Scan Pump
            </button>
            <button
              className={`fuel-quick-btn${listening ? ' fuel-quick-btn--active' : ''}`}
              onClick={handleVoice}
              disabled={scanning}
              title="Say your fill-up details"
            >
              {listening ? '🔴' : '🎤'} {listening ? 'Stop' : 'Say It'}
            </button>
          </div>
          {scanMsg && <div className="fuel-scan-msg">{scanMsg}</div>}
        </div>

        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleScanPhoto}
        />

        <label className="modal-label">
          <span>Date</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>

        <label className="modal-label">
          <span>{useMetric ? 'Odometer (km)' : 'Odometer (miles)'}</span>
          <input
            type="number"
            value={mileage}
            onChange={e => setMileage(e.target.value)}
            min="0"
          />
        </label>

        <label className="modal-label">
          <span>{useMetric ? 'Liters pumped' : 'Gallons pumped'}</span>
          <div className="fuel-amount-wrap">
            <input
              type="number"
              placeholder={useMetric ? '45.0' : '12.5'}
              value={gallons}
              onChange={e => setGallons(e.target.value)}
              min="0"
              step="0.001"
            />
            <span className="fuel-unit">{unit}</span>
          </div>
        </label>

        <label className="modal-label">
          <span>Price per {unit} (optional)</span>
          <div className="cost-wrap">
            <span className="cost-dollar">$</span>
            <input
              type="number"
              placeholder={useMetric ? '1.55' : '3.49'}
              value={pricePerUnit}
              onChange={e => { setPricePerUnit(e.target.value); setTotalCost('') }}
              min="0"
              step="0.001"
              className="cost-input"
            />
          </div>
        </label>

        <label className="modal-label">
          <span>Total cost (optional)</span>
          <div className="cost-wrap">
            <span className="cost-dollar">$</span>
            <input
              type="number"
              placeholder={displayCost || '0.00'}
              value={totalCost}
              onChange={e => { setTotalCost(e.target.value); setPricePerUnit('') }}
              min="0"
              step="0.01"
              className="cost-input"
            />
          </div>
          {computedCost && !totalCost && (
            <span className="field-hint">Auto-calculated: ${computedCost}</span>
          )}
        </label>

        <label className="fuel-checkbox-row">
          <input
            type="checkbox"
            checked={fullTank}
            onChange={e => setFullTank(e.target.checked)}
          />
          <span>Filled to full tank</span>
          <span className="fuel-checkbox-hint">Required for accurate MPG</span>
        </label>

        <label className="modal-label">
          <span>Notes (optional)</span>
          <textarea
            placeholder="e.g. Shell V-Power, highway trip..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
          />
        </label>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving || !canSave}
          >
            {saving ? 'Saving...' : 'Log Fill-Up'}
          </button>
        </div>
      </div>
    </div>
  )
}
