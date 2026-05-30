import './FuelTab.css'

function calcMpg(curr, prev, useMetric) {
  if (!curr.fullTank || !prev.fullTank) return null
  const distance = curr.mileage - prev.mileage
  if (distance <= 0 || !curr.gallons) return null
  if (useMetric) {
    return ((curr.gallons / distance) * 100).toFixed(1) // L/100km
  }
  return (distance / curr.gallons).toFixed(1)           // MPG
}

export default function FuelTab({ records, useMetric, onAddFuel, onDeleteFuel }) {
  const sorted = [...records].sort((a, b) => b.mileage - a.mileage)

  const withMpg = sorted.map((r, i) => {
    const prev = sorted[i + 1]
    const mpg = prev ? calcMpg(r, prev, useMetric) : null
    return { ...r, mpg }
  })

  const validMpgs = withMpg.map(r => r.mpg).filter(Boolean).map(Number)
  const avgMpg = validMpgs.length
    ? (validMpgs.reduce((a, b) => a + b, 0) / validMpgs.length).toFixed(1)
    : null

  const totalCost = records.reduce((sum, r) => sum + (r.totalCost || 0), 0)
  const totalGallons = records.reduce((sum, r) => sum + (r.gallons || 0), 0)
  const unit = useMetric ? 'L' : 'gal'
  const effLabel = useMetric ? 'L/100km' : 'MPG'

  return (
    <div className="fuel-tab">
      {records.length > 0 && (
        <div className="fuel-stats">
          {avgMpg && (
            <div className="fuel-stat">
              <div className="fuel-stat-value">{avgMpg}</div>
              <div className="fuel-stat-label">Avg {effLabel}</div>
            </div>
          )}
          <div className="fuel-stat">
            <div className="fuel-stat-value">{records.length}</div>
            <div className="fuel-stat-label">Fill-ups</div>
          </div>
          {totalGallons > 0 && (
            <div className="fuel-stat">
              <div className="fuel-stat-value">{totalGallons.toFixed(0)}</div>
              <div className="fuel-stat-label">Total {unit}</div>
            </div>
          )}
          {totalCost > 0 && (
            <div className="fuel-stat">
              <div className="fuel-stat-value">${totalCost.toFixed(0)}</div>
              <div className="fuel-stat-label">Total spent</div>
            </div>
          )}
        </div>
      )}

      <button className="fuel-add-btn" onClick={onAddFuel}>
        + Log Fill-Up
      </button>

      {records.length === 0 ? (
        <div className="fuel-empty">
          <div className="fuel-empty-icon">⛽</div>
          <div className="fuel-empty-title">No fill-ups logged yet</div>
          <div className="fuel-empty-body">Log your fill-ups to track MPG and fuel costs over time.</div>
        </div>
      ) : (
        <div className="fuel-list">
          {withMpg.map((r, i) => {
            const dateStr = r.date
              ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null
            return (
              <div key={r.id || i} className="fuel-card">
                <div className="fuel-card-top">
                  <div className="fuel-card-left">
                    <div className="fuel-card-mileage">
                      {r.mileage?.toLocaleString()} {useMetric ? 'km' : 'mi'}
                    </div>
                    {dateStr && <div className="fuel-card-date">{dateStr}</div>}
                  </div>
                  {r.mpg && (
                    <div className="fuel-mpg-badge">
                      {r.mpg} {effLabel}
                    </div>
                  )}
                </div>
                <div className="fuel-card-chips">
                  <span className="fuel-chip">{r.gallons?.toFixed(useMetric ? 1 : 2)} {unit}</span>
                  {r.pricePerUnit && (
                    <span className="fuel-chip">${r.pricePerUnit.toFixed(3)}/{unit}</span>
                  )}
                  {r.totalCost != null && (
                    <span className="fuel-chip fuel-chip-cost">${r.totalCost.toFixed(2)}</span>
                  )}
                  {!r.fullTank && (
                    <span className="fuel-chip fuel-chip-partial">Partial</span>
                  )}
                </div>
                {r.notes && <div className="fuel-card-notes">{r.notes}</div>}
                {onDeleteFuel && (
                  <div className="fuel-card-footer">
                    <button
                      className="delete-record-btn"
                      onClick={() => {
                        if (confirm('Remove this fill-up?')) onDeleteFuel(r.id)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
