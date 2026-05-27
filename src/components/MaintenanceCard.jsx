import { useState } from 'react'
import './MaintenanceCard.css'

function statusInfo(item, nextMileage, currentMileage, lastRecord) {
  if (!lastRecord && !nextMileage) return { label: 'Not set up', color: '#999', pct: 0 }
  if (!nextMileage) return { label: 'No interval set', color: '#999', pct: 0 }

  const intervalMiles = nextMileage - (lastRecord?.mileage ?? currentMileage)
  const remaining = nextMileage - currentMileage
  const pct = Math.max(0, Math.min(100, (remaining / intervalMiles) * 100))

  if (remaining <= 0) return { label: 'Overdue', color: '#d32f2f', pct: 0 }
  if (remaining <= intervalMiles * 0.1) return { label: `Due in ${remaining.toLocaleString()} mi`, color: '#f57c00', pct }
  return { label: `Next at ${nextMileage.toLocaleString()} mi`, color: '#2e7d32', pct }
}

export default function MaintenanceCard({
  item, lastRecord, nextMileage, currentMileage, intervalMiles, dueInfo, onIntervalChange, onLog
}) {
  const [editingInterval, setEditingInterval] = useState(false)
  const [intervalInput, setIntervalInput] = useState(intervalMiles || item.defaultIntervalMiles || '')
  const [expanded, setExpanded] = useState(false)

  const { estimatedDate, reason } = dueInfo || {}

  const isTimeLimitSooner = reason === 'time'

  // For time-only items (battery), derive a time-based status
  const timeStatus = (() => {
    if (!estimatedDate || !isTimeLimitSooner) return null
    const today = new Date()
    const daysOut = Math.round((estimatedDate - today) / (1000 * 60 * 60 * 24))
    if (daysOut <= 0) return { label: 'Overdue (time limit)', color: '#d32f2f', pct: 0 }
    if (daysOut <= 30) return { label: `Due in ${daysOut} days (time limit)`, color: '#f57c00', pct: Math.max(10, 100 - (daysOut / 30) * 100) }
    return { label: `Due ${estimatedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} (time limit)`, color: '#2e7d32', pct: 60 }
  })()

  const mileageStatus = item.unit === 'miles'
    ? statusInfo(item, nextMileage, currentMileage, lastRecord)
    : { label: item.defaultIntervalMonths ? `Every ${item.defaultIntervalMonths} months` : 'Time-based', color: '#1a73e8', pct: 50 }

  // Use time status if it fires sooner
  const status = (isTimeLimitSooner && timeStatus) ? timeStatus : mileageStatus

  const handleIntervalSave = () => {
    const val = Number(intervalInput)
    if (val > 0) onIntervalChange(val)
    setEditingInterval(false)
  }

  const formattedDueDate = estimatedDate
    ? estimatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="maintenance-card" style={{ '--status-color': status.color }}>
      <div className="card-top" onClick={() => setExpanded(e => !e)}>
        <div className="card-icon">{item.icon}</div>
        <div className="card-info">
          <div className="card-label">{item.label}</div>
          <div className="card-status" style={{ color: status.color }}>{status.label}</div>
          {status.pct > 0 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${status.pct}%`, background: status.color }} />
            </div>
          )}
        </div>
        <div className="card-chevron">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="card-detail">
          {lastRecord && (
            <div className="detail-row">
              <span>Last done at</span>
              <span>{lastRecord.mileage.toLocaleString()} mi</span>
            </div>
          )}
          {item.unit === 'miles' && (
            <div className="detail-row interval-row">
              <span>Mileage interval</span>
              {editingInterval ? (
                <span className="interval-edit">
                  <input
                    type="number"
                    value={intervalInput}
                    onChange={e => setIntervalInput(e.target.value)}
                    autoFocus
                  />
                  <span>mi</span>
                  <button onClick={handleIntervalSave}>✓</button>
                  <button onClick={() => setEditingInterval(false)}>✕</button>
                </span>
              ) : (
                <span className="interval-value" onClick={() => { setIntervalInput(intervalMiles); setEditingInterval(true) }}>
                  {(intervalMiles || item.defaultIntervalMiles || '—').toLocaleString()} mi ✏️
                </span>
              )}
            </div>
          )}
          {item.defaultIntervalMonths && (
            <div className="detail-row">
              <span>Time interval</span>
              <span>{item.defaultIntervalMonths} months</span>
            </div>
          )}
          {formattedDueDate && (
            <div className="detail-row">
              <span>Est. due date</span>
              <span className={isTimeLimitSooner ? 'due-time-limit' : ''}>
                {formattedDueDate}
                {isTimeLimitSooner ? ' ⏱' : ''}
              </span>
            </div>
          )}
          {!lastRecord && item.defaultIntervalMonths && (
            <div className="time-hint">
              Log your last service to enable time-based reminders
            </div>
          )}
          {lastRecord?.notes && (
            <div className="detail-row">
              <span>Notes</span>
              <span>{lastRecord.notes}</span>
            </div>
          )}
          <button className="log-btn" onClick={() => { setExpanded(false); onLog() }}>
            Log Service Done
          </button>
        </div>
      )}
    </div>
  )
}
