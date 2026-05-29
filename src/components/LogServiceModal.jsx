import { useState } from 'react'
import { playBurnout } from '../utils/sounds'
import './LogServiceModal.css'

export default function LogServiceModal({ item, currentMileage, oilWeight, filterPartNumber, onSave, onClose, resetMode }) {
  const [mileage, setMileage] = useState(currentMileage)
  const [notes, setNotes]     = useState('')
  const [cost, setCost]       = useState('')
  const [checked, setChecked] = useState({})
  const [saving, setSaving]   = useState(false)

  const title = resetMode ? item.resetAction?.label : `Log ${item.label}`
  const toggleCheck = (id) => setChecked(c => ({ ...c, [id]: !c[id] }))
  const allSubItemsChecked = !item.subItems || item.subItems.every(s => checked[s.id])

  const handleSave = async () => {
    if (!allSubItemsChecked) return
    setSaving(true)
    playBurnout()
    await onSave({
      itemId:    item.id,
      itemLabel: item.label,
      type:      resetMode ? 'reset' : 'service',
      resetLabel: resetMode ? item.resetAction?.label : null,
      mileage:   Number(mileage),
      date:      new Date().toISOString(),
      notes,
      cost:      cost ? parseFloat(parseFloat(cost).toFixed(2)) : null,
      subItems:  item.subItems ? item.subItems.filter(s => checked[s.id]).map(s => s.id) : [],
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <h3>{title}</h3>
          {resetMode && (
            <p className="reset-notice">Resets the interval clock from this mileage forward.</p>
          )}
        </div>

        {item.id === 'oil_change' && !resetMode && (oilWeight || filterPartNumber) && (
          <div className="oil-ref-bar">
            {oilWeight && (
              <span className="oil-ref-chip">
                <span className="oil-ref-label">Oil</span>
                {oilWeight}
              </span>
            )}
            {filterPartNumber && (
              <span className="oil-ref-chip">
                <span className="oil-ref-label">Filter</span>
                {filterPartNumber}
              </span>
            )}
          </div>
        )}

        <label className="modal-label">
          <span>Mileage at service</span>
          <input
            type="number"
            value={mileage}
            onChange={e => setMileage(e.target.value)}
            min="0"
          />
        </label>

        {item.subItems && (
          <div className="sub-items">
            <div className="sub-items-label">Confirm completed</div>
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
              <div className="sub-items-warning">Both must be checked to save</div>
            )}
          </div>
        )}

        <label className="modal-label">
          <span>Notes (optional)</span>
          <textarea
            placeholder={item.id === 'oil_change' ? 'e.g. Mobil 1 5W-30, Jiffy Lube...' : 'e.g. shop name, brand used...'}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
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
