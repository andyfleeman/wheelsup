import { useState } from 'react'
import { fromMiles, toMiles } from '../utils/units'
import './FuelLogModal.css'

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

  const unit = useMetric ? 'L' : 'gal'

  const computedCost = gallons && pricePerUnit
    ? (parseFloat(gallons) * parseFloat(pricePerUnit)).toFixed(2)
    : ''

  const displayCost = totalCost || computedCost

  const canSave = date && mileage && gallons && parseFloat(gallons) > 0

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
        </div>

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
              autoFocus
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
