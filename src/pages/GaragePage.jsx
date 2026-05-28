import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getVehicles, deleteVehicle } from '../services/db'
import './GaragePage.css'

export default function GaragePage({ onSelectVehicle, onAddVehicle }) {
  const { user, logout } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getVehicles(user.uid).then(v => { setVehicles(v); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (vehicleId, e) => {
    e.stopPropagation()
    if (!confirm('Remove this vehicle from your garage?')) return
    await deleteVehicle(user.uid, vehicleId)
    load()
  }

  const firstName = user?.email?.split('@')[0]?.split('.')[0]
  const greeting = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1) + "'s Garage"
    : 'My Garage'

  return (
    <div className="garage-page">
      <div className="garage-header">
        <div className="garage-header-top">
          <span className="garage-wordmark">Klutch</span>
          <button className="logout-btn" onClick={logout}>Sign out</button>
        </div>
        <h1 className="garage-title">{greeting}</h1>
      </div>

      <div className="garage-body">
        {loading ? (
          <div className="loading">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-badge">GARAGE EMPTY</div>
            <h3>Add your first vehicle</h3>
            <p>Tap the button below to start tracking maintenance.</p>
          </div>
        ) : (
          <div className="vehicle-list">
            {vehicles.map(v => (
              <div key={v.id} className="vehicle-card" onClick={() => onSelectVehicle(v)}>
                <div className="vehicle-badge">{v.make?.charAt(0) || 'V'}</div>
                <div className="vehicle-info">
                  <div className="vehicle-name">
                    {v.nickname || `${v.year} ${v.make} ${v.model}`}
                  </div>
                  {v.nickname && (
                    <div className="vehicle-sub">{v.year} {v.make} {v.model}</div>
                  )}
                  <div className="vehicle-meta">
                    <span className="vehicle-mileage-chip">{v.currentMileage?.toLocaleString()} mi</span>
                    {v.engineType && <span className="vehicle-engine-chip">{v.engineType}</span>}
                  </div>
                </div>
                <div className="vehicle-card-right">
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(v.id, e)}
                    title="Remove vehicle"
                  >
                    Remove
                  </button>
                  <div className="vehicle-arrow">›</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="fab" onClick={onAddVehicle}>+ Add Vehicle</button>
    </div>
  )
}
