import { useState } from 'react'
import { fromMiles, toMiles } from '../utils/units'
import './RepairLogModal.css'

export default function RepairLogModal({ currentMileage, useMetric, onSave, onClose }) {
  const [description, setDescription] = useState('')
  const [shop, setShop]               = useState('')
  const [mileage, setMileage]         = useState(fromMiles(currentMileage, useMetric))
  const [cost, setCost]               = useState('')
  const [notes, setNotes]             = useState('')
  const [saving, setSaving]           = useState(false)

  const canSave = description.trim().length > 0

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    await onSave({
      itemId:    'repair',
      itemLabel: description.trim(),
      type:      'repair',
      shop:      shop.trim() || null,
      mileage:   toMiles(Number(mileage), useMetric),
      date:      new Date().toISOString(),
      notes:     notes.trim() || null,
      cost:      cost ? parseFloat(parseFloat(cost).toFixed(2)) : null,
      subItems:  [],
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet repair-modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <h3>Log Repair</h3>
          <p className="repair-modal-sub">Track an unscheduled repair or shop visit.</p>
        </div>

        <label className="modal-label">
          <span>What was done? *</span>
          <input
            type="text"
            placeholder="e.g. Replaced front brake pads"
            value={description}
            onChange={e => setDescription(e.target.value)}
            autoFocus
          />
        </label>

        <label className="modal-label">
          <span>Shop / Provider</span>
          <input
            type="text"
            placeholder="e.g. Firestone, Joe's Auto, DIY"
            value={shop}
            onChange={e => setShop(e.target.value)}
          />
        </label>

        <label className="modal-label">
          <span>{useMetric ? 'Kilometers' : 'Mileage'} at service</span>
          <input
            type="number"
            value={mileage}
            onChange={e => setMileage(e.target.value)}
            min="0"
          />
        </label>

        <label className="modal-label">
          <span>Cost (optional)</span>
          <div className="cost-wrap">
            <span className="cost-dollar">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={cost}
              onChange={e => setCost(e.target.value)}
              min="0"
              step="0.01"
              className="cost-input"
            />
          </div>
        </label>

        <label className="modal-label">
          <span>Notes (optional)</span>
          <textarea
            placeholder="Parts used, warranty info, anything else..."
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
            {saving ? 'Saving...' : 'Log Repair'}
          </button>
        </div>
      </div>
    </div>
  )
}
