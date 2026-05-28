import { MAINTENANCE_ITEMS } from '../data/maintenanceItems'
import './LogbookPage.css'

const ITEM_MAP = Object.fromEntries(MAINTENANCE_ITEMS.map(i => [i.id, i]))

function serviceLabel(record) {
  if (record.type === 'reset' && record.resetLabel) return record.resetLabel
  const item = ITEM_MAP[record.itemId]
  if (!item) return record.itemLabel || record.itemId
  if (item.subItems?.length && record.subItems?.length === item.subItems.length) {
    return `${item.label} + Filter`
  }
  return item.label
}

export default function LogbookPage({ vehicle, records, onDeleteRecord }) {
  const sorted = [...records].sort((a, b) => {
    const da = a.date ? new Date(a.date) : 0
    const db2 = b.date ? new Date(b.date) : 0
    return db2 - da
  })

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0)

  const vehicleLabel = vehicle.nickname
    ? `${vehicle.nickname} — ${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  return (
    <div className="logbook-page">
      <div className="logbook-toolbar no-print">
        <div className="logbook-toolbar-left">
          <span className="logbook-count">{records.length} record{records.length !== 1 ? 's' : ''}</span>
          {totalCost > 0 && (
            <span className="logbook-total">${totalCost.toFixed(2)} total</span>
          )}
        </div>
        <button className="print-btn" onClick={() => window.print()}>Print</button>
      </div>

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

        {sorted.length === 0 ? (
          <div className="logbook-empty">No service records yet. Log a service to get started.</div>
        ) : (
          <table className="logbook-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mileage</th>
                <th>Service</th>
                <th>Cost</th>
                <th>Notes</th>
                {onDeleteRecord && <th className="no-print col-actions"></th>}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id || i} className={r.type === 'reset' ? 'row-reset' : ''}>
                  <td className="col-date">
                    {r.date
                      ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="col-mileage">{r.mileage?.toLocaleString()} mi</td>
                  <td className="col-service">
                    {r.type === 'reset' && <span className="reset-badge">NEW</span>}
                    {serviceLabel(r)}
                  </td>
                  <td className="col-cost">
                    {r.cost != null ? `$${Number(r.cost).toFixed(2)}` : '—'}
                  </td>
                  <td className="col-notes">{r.notes || '—'}</td>
                  {onDeleteRecord && (
                    <td className="no-print col-actions">
                      <button
                        className="delete-record-btn"
                        onClick={() => {
                          if (confirm(`Remove this ${serviceLabel(r)} record?`)) {
                            onDeleteRecord(r.id)
                          }
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="logbook-print-footer">Klutch — Vehicle Maintenance Tracker</div>
      </div>
    </div>
  )
}
