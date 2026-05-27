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
  item, lastRecord, nextMileage, currentMileage, intervalMiles, estimatedDate, onIntervalChange, onLog
}) {
  const [editingInterval, setEditingInterval] = useState(false)
  const [intervalInput, setIntervalInput] = useState(intervalMiles || item.defaultIntervalMiles || '')
  const [expanded, setExpanded] = useState(false)

  const status = item.unit === 'miles'
    ? statusInfo(item, nextMileage, currentMileage, lastRecord)
    : { label: item.defaultIntervalMonths ? `Every ${item.defaultIntervalMonths} months` : 'Time-based', color: '#1a73e8', pct: 50 }

  const handleIntervalSave = () => {
    const val = Number(intervalInput)
    if (val > 0) onIntervalChange(val)
    setEditingInterval(false)
  }

  return (
    <div className="maintenance-card" style={{ '--status-color': status.color }}>
      <div className="card-top" onClick={() => setExpanded(e => !e)}>
        <div className="card-icon">{item.icon}</div>
        <div className="card-info">
          <div className="card-label">{item.label}</div>
          <div className="card-status" style={{ color: status.color }}>{status.label}</div>
          {item.unit === 'miles' && status.pct > 0 && (
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
              <span>Interval</span>
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
          {estimatedDate && (
            <div className="detail-row">
              <span>Est. due date</span>
              <span>{estimatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
