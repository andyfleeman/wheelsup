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

  const handleDelete = async (vehicleId) => {
    if (!confirm('Remove this vehicle?')) return
    await deleteVehicle(user.uid, vehicleId)
    load()
  }

  return (
    <div className="garage-page">
      <div className="garage-header">
        <div>
          <h1>WheelsUp</h1>
          <p className="garage-subtitle">My Garage</p>
        </div>
        <button className="logout-btn" onClick={logout} title="Sign out">Sign out</button>
      </div>

      {loading ? (
        <div className="loading">Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">NO VEHICLES</div>
          <h3>Your garage is empty</h3>
          <p>Add your first vehicle to start tracking maintenance.</p>
        </div>
      ) : (
        <div className="vehicle-list">
          {vehicles.map(v => (
            <div key={v.id} className="vehicle-card" onClick={() => onSelectVehicle(v)}>
              <div className="vehicle-card-main">
                <div className="vehicle-icon">{v.make?.charAt(0) || 'V'}</div>
                <div className="vehicle-info">
                  <div className="vehicle-name">
                    {v.nickname || `${v.year} ${v.make} ${v.model}`}
                  </div>
                  {v.nickname && (
                    <div className="vehicle-sub">{v.year} {v.make} {v.model}</div>
                  )}
                  <div className="vehicle-mileage">{v.currentMileage?.toLocaleString()} mi</div>
                </div>
                <div className="vehicle-arrow">›</div>
              </div>
              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); handleDelete(v.id) }}
                title="Remove vehicle"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="fab" onClick={onAddVehicle}>+ Add Vehicle</button>
    </div>
  )
}
