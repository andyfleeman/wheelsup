import { useState } from 'react'
import './LogServiceModal.css'

export default function LogServiceModal({ item, currentMileage, onSave, onClose }) {
  const [mileage, setMileage] = useState(currentMileage)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave({
      itemId: item.id,
      itemLabel: item.label,
      mileage: Number(mileage),
      notes,
      date: new Date().toISOString(),
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3>Log {item.icon} {item.label}</h3>

        <label>
          Mileage at service
          <input
            type="number"
            value={mileage}
            onChange={e => setMileage(e.target.value)}
            min="0"
          />
        </label>

        <label>
          Notes (optional)
          <textarea
            placeholder="e.g. oil brand used, shop name..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </label>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
