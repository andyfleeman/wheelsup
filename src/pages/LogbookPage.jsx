import { MAINTENANCE_ITEMS } from '../data/maintenanceItems'
import './LogbookPage.css'

const ITEM_MAP = Object.fromEntries(MAINTENANCE_ITEMS.map(i => [i.id, i]))

function serviceLabel(record) {
  if (record.type === 'repair') return record.itemLabel || 'Repair'
  if (record.type === 'reset' && record.resetLabel) return record.resetLabel
  const item = ITEM_MAP[record.itemId]
  if (!item) return record.itemLabel || record.itemId
  if (item.subItems?.length && record.subItems?.length === item.subItems.length) {
    return `${item.label} + Filter`
  }
  return item.label
}

function exportCSV(records, vehicleLabel) {
  const rows = [
    ['Date', 'Mileage', 'Service', 'Shop', 'Cost', 'Notes'],
    ...records.map(r => [
      r.date ? new Date(r.date).toLocaleDateString('en-US') : '',
      r.mileage ?? '',
      serviceLabel(r),
      r.shop || '',
      r.cost != null ? r.cost.toFixed(2) : '',
      r.notes || '',
    ])
  ]
  const csv = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${vehicleLabel.replace(/[^a-z0-9]/gi, '_')}_service_log.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function LogbookPage({ vehicle, records, onDeleteRecord, onLogRepair }) {
  const sorted = [...records].sort((a, b) => {
    const da = a.date ? new Date(a.date) : 0
    const db2 = b.date ? new Date(b.date) : 0
    return db2 - da
  })

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0)
  const repairCount = records.filter(r => r.type === 'repair').length

  const vehicleLabel = vehicle.nickname
    ? `${vehicle.nickname} — ${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  const fileLabel = vehicle.nickname || `${vehicle.year}_${vehicle.make}_${vehicle.model}`

  return (
    <div className="logbook-page">
      <div className="logbook-toolbar no-print">
        <div className="logbook-toolbar-left">
          <span className="logbook-count">{records.length} record{records.length !== 1 ? 's' : ''}</span>
          {totalCost > 0 && (
            <span className="logbook-total">${totalCost.toFixed(2)} tracked</span>
          )}
        </div>
        <div className="logbook-toolbar-right">
          {records.length > 0 && (
            <button
              className="export-csv-btn"
              onClick={() => exportCSV(sorted, fileLabel)}
              title="Export as CSV"
            >
              Export CSV
            </button>
          )}
          <button className="print-btn" onClick={() => window.print()}>Print</button>
        </div>
      </div>

      {/* Screen view */}
      <div className="logbook-cards no-print">
        {onLogRepair && (
          <button className="logbook-repair-btn" onClick={onLogRepair}>
            + Log a Repair or Shop Visit
          </button>
        )}
        {sorted.length === 0 ? (
          <div className="logbook-empty">
            No service records yet. Log a service to start building your car's history.
          </div>
        ) : (
          sorted.map((r, i) => {
            const label = serviceLabel(r)
            const isRepair = r.type === 'repair'
            const dateStr = r.date
              ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null
            return (
              <div key={r.id || i} className={`log-card${r.type === 'reset' ? ' log-card-reset' : ''}${isRepair ? ' log-card-repair' : ''}`}>
                <div className="log-card-top">
                  <div className="log-card-service">
                    {r.type === 'reset' && <span className="reset-badge">RESET</span>}
                    {isRepair && <span className="repair-badge">REPAIR</span>}
                    {label}
                  </div>
                  {dateStr && <div className="log-card-date">{dateStr}</div>}
                </div>
                <div className="log-card-chips">
                  <span className="log-chip log-chip-mileage">{r.mileage?.toLocaleString()} mi</span>
                  {r.shop && (
                    <span className="log-chip log-chip-shop">{r.shop}</span>
                  )}
                  {r.cost != null && (
                    <span className="log-chip log-chip-cost">${Number(r.cost).toFixed(2)}</span>
                  )}
                </div>
                {r.notes && <div className="log-card-notes">{r.notes}</div>}
                {onDeleteRecord && (
                  <div className="log-card-footer">
                    <button
                      className="delete-record-btn"
                      onClick={() => {
                        if (confirm(`Remove this ${label} record?`)) onDeleteRecord(r.id)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Print view */}
      <div className="logbook-print-area">
        <div className="logbook-print-header">
          <div className="print-title">Vehicle Maintenance Log</div>
          <div className="print-vehicle">{vehicleLabel}</div>
          <div className="print-meta">
            {vehicle.currentMileage?.toLocaleString()} mi &nbsp;·&nbsp;
            Printed {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {totalCost > 0 && ` · $${totalCost.toFixed(2)} tracked`}
          </div>
        </div>

        {sorted.length > 0 && (
          <table className="logbook-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mileage</th>
                <th>Service</th>
                <th>Shop</th>
                <th>Cost</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id || i} className={r.type === 'reset' ? 'row-reset' : r.type === 'repair' ? 'row-repair' : ''}>
                  <td className="col-date">
                    {r.date
                      ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="col-mileage">{r.mileage?.toLocaleString()} mi</td>
                  <td className="col-service">
                    {r.type === 'reset' && <span className="reset-badge">RESET</span>}
                    {r.type === 'repair' && <span className="repair-badge">REPAIR</span>}
                    {serviceLabel(r)}
                  </td>
                  <td className="col-shop">{r.shop || '—'}</td>
                  <td className="col-cost">{r.cost != null ? `$${Number(r.cost).toFixed(2)}` : '—'}</td>
                  <td className="col-notes">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="logbook-print-footer">Klyp — Vehicle Maintenance Tracker · klyp.app</div>
      </div>
    </div>
  )
}
