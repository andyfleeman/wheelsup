import { useState } from 'react'
import './LogServiceModal.css'

export default function LogServiceModal({ item, currentMileage, onSave, onClose, resetMode }) {
  const [mileage, setMileage] = useState(currentMileage)
  const [notes, setNotes]     = useState('')
  const [checked, setChecked] = useState({})
  const [saving, setSaving]   = useState(false)

  const title = resetMode
    ? item.resetAction?.label
    : `Log ${item.label}`

  const toggleCheck = (id) => setChecked(c => ({ ...c, [id]: !c[id] }))

  const allSubItemsChecked = !item.subItems || item.subItems.every(s => checked[s.id])

  const handleSave = async () => {
    if (!allSubItemsChecked) return
    setSaving(true)
    await onSave({
      itemId:    item.id,
      itemLabel: item.label,
      type:      resetMode ? 'reset' : 'service',
      resetLabel: resetMode ? item.resetAction?.label : null,
      mileage:   Number(mileage),
      date:      new Date().toISOString(),
      notes,
      subItems:  item.subItems ? item.subItems.filter(s => checked[s.id]).map(s => s.id) : [],
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3>{title}</h3>

        {resetMode && (
          <div className="reset-notice">
            This resets the interval clock from this mileage and date forward.
          </div>
        )}

        <label>
          Mileage at service
          <input
            type="number"
            value={mileage}
            onChange={e => setMileage(e.target.value)}
            min="0"
          />
        </label>

        {item.subItems && (
          <div className="sub-items">
            <div className="sub-items-label">Confirm completed:</div>
            {item.subItems.map(s => (
              <label key={s.id} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={!!checked[s.id]}
                  onChange={() => toggleCheck(s.id)}
                />
                <span>{s.label}</span>
              </label>
            ))}
            {!allSubItemsChecked && (
              <div className="sub-items-warning">Both must be checked to log this service</div>
            )}
          </div>
        )}

        <label>
          Notes (optional)
          <textarea
            placeholder={item.id === 'oil_change' ? 'e.g. Mobil 1 5W-30, Fram filter...' : 'e.g. shop name, brand used...'}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </label>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving || !allSubItemsChecked}
          >
            {saving ? 'Saving...' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
