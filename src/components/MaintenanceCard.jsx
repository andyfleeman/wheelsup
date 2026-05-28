import { useState } from 'react'
import './MaintenanceCard.css'

function statusInfo(item, nextMileage, currentMileage, lastRecord) {
  if (!lastRecord && !nextMileage) return { label: 'Not tracked', color: '#aaa', pct: 0 }
  if (!nextMileage) return { label: 'No interval set', color: '#aaa', pct: 0 }

  const intervalMiles = nextMileage - (lastRecord?.mileage ?? currentMileage)
  const remaining = nextMileage - currentMileage
  const pct = Math.max(0, Math.min(100, (remaining / intervalMiles) * 100))

  if (remaining <= 0) return { label: `${Math.abs(remaining).toLocaleString()} mi overdue`, color: '#c62828', pct: 0 }
  if (remaining <= intervalMiles * 0.1) return { label: `${remaining.toLocaleString()} mi left`, color: '#f57c00', pct }
  return { label: `Next at ${nextMileage.toLocaleString()} mi`, color: '#2e7d32', pct }
}

export default function MaintenanceCard({
  item, lastRecord, nextMileage, currentMileage, intervalMiles, dueInfo, onIntervalChange, onLog, onReset
}) {
  const [editingInterval, setEditingInterval] = useState(false)
  const [intervalInput, setIntervalInput] = useState(intervalMiles || item.defaultIntervalMiles || '')
  const [expanded, setExpanded] = useState(false)

  const { estimatedDate, reason } = dueInfo || {}
  const isTimeLimitSooner = reason === 'time'

  const daysUntil = estimatedDate
    ? Math.round((estimatedDate - new Date()) / (1000 * 60 * 60 * 24))
    : null

  const timeStatus = (() => {
    if (!estimatedDate || !isTimeLimitSooner) return null
    const today = new Date()
    const daysOut = Math.round((estimatedDate - today) / (1000 * 60 * 60 * 24))
    if (daysOut <= 0) return { label: 'Time limit reached', color: '#c62828' }
    if (daysOut <= 30) return { label: `${daysOut}d time limit`, color: '#f57c00' }
    return { label: `${estimatedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} time limit`, color: '#888' }
  })()

  const mileageStatus = item.unit === 'miles'
    ? statusInfo(item, nextMileage, currentMileage, lastRecord)
    : { label: item.defaultIntervalMonths ? `Every ${item.defaultIntervalMonths} mo` : 'Time-based', color: '#1a73e8', pct: 50 }

  const status = mileageStatus
  const borderColor = (isTimeLimitSooner && timeStatus) ? timeStatus.color : status.color

  const handleIntervalSave = () => {
    const val = Number(intervalInput)
    if (val > 0) onIntervalChange(val)
    setEditingInterval(false)
  }

  const formattedDueDate = estimatedDate
    ? estimatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const lastDoneDate = lastRecord?.date
    ? new Date(lastRecord.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const daysDisplay = (() => {
    if (daysUntil === null) return null
    if (daysUntil < 0) return { text: `${Math.abs(daysUntil)}d overdue`, color: '#c62828' }
    if (daysUntil === 0) return { text: 'due today', color: '#c62828' }
    if (daysUntil <= 14) return { text: `in ${daysUntil}d`, color: '#f57c00' }
    if (daysUntil <= 30) return { text: `in ${daysUntil}d`, color: '#888' }
    return { text: `in ${daysUntil}d`, color: '#bbb' }
  })()

  return (
    <div className="maintenance-card" style={{ '--border-color': borderColor }}>
      <div className="card-top" onClick={() => setExpanded(e => !e)}>
        <div className="card-info">
          <div className="card-header-row">
            <div className="card-label">{item.label}</div>
            <div className="card-chevron" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</div>
          </div>
          <div className="card-meta-row">
            <div
              className="status-pill"
              style={{
                background: `${status.color}14`,
                color: status.color,
                border: `1px solid ${status.color}28`,
              }}
            >
              {status.label}
            </div>
            {daysDisplay && (
              <div className="days-chip" style={{ color: daysDisplay.color }}>
                {daysDisplay.text}
              </div>
            )}
          </div>
          {status.pct > 0 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${status.pct}%`, background: status.color }} />
            </div>
          )}
          {isTimeLimitSooner && timeStatus && (
            <div className="time-limit-chip" style={{ color: timeStatus.color }}>
              {timeStatus.label}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="card-detail">
          {lastRecord && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-key">Last done</span>
                <span className="detail-val">{lastRecord.mileage.toLocaleString()} mi{lastDoneDate ? ` · ${lastDoneDate}` : ''}</span>
              </div>
              {lastRecord.cost != null && (
                <div className="detail-row">
                  <span className="detail-key">Cost</span>
                  <span className="detail-val">${Number(lastRecord.cost).toFixed(2)}</span>
                </div>
              )}
              {lastRecord.notes && (
                <div className="detail-row">
                  <span className="detail-key">Notes</span>
                  <span className="detail-val notes-val">{lastRecord.notes}</span>
                </div>
              )}
            </div>
          )}

          <div className="detail-section">
            {item.unit === 'miles' && (
              <div className="detail-row interval-row">
                <span className="detail-key">Interval</span>
                {editingInterval ? (
                  <span className="interval-edit">
                    <input
                      type="number"
                      value={intervalInput}
                      onChange={e => setIntervalInput(e.target.value)}
                      autoFocus
                    />
                    <span className="interval-unit">mi</span>
                    <button className="interval-save-btn" onClick={handleIntervalSave}>Save</button>
                    <button className="interval-cancel-btn" onClick={() => setEditingInterval(false)}>✕</button>
                  </span>
                ) : (
                  <span className="interval-value" onClick={() => { setIntervalInput(intervalMiles); setEditingInterval(true) }}>
                    {(intervalMiles || item.defaultIntervalMiles || '—').toLocaleString()} mi
                    <span className="edit-hint"> · edit</span>
                  </span>
                )}
              </div>
            )}

            {item.defaultIntervalMonths && (
              <div className="detail-row">
                <span className="detail-key">Time limit</span>
                <span className="detail-val">{item.defaultIntervalMonths} months</span>
              </div>
            )}

            {formattedDueDate && (
              <div className="detail-row">
                <span className="detail-key">Est. due</span>
                <span className={`detail-val ${isTimeLimitSooner ? 'val-warning' : ''}`}>
                  {formattedDueDate}{isTimeLimitSooner ? ' (time)' : ''}
                </span>
              </div>
            )}
          </div>

          {!lastRecord && item.defaultIntervalMonths && (
            <div className="time-hint">Log a service to enable time-based tracking</div>
          )}

          <div className="card-actions">
            <button className="log-btn" onClick={() => { setExpanded(false); onLog() }}>
              Log Service
            </button>
            {item.resetAction && (
              <button className="reset-btn" onClick={() => { setExpanded(false); onReset() }}>
                {item.resetAction.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
