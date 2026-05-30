import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserPrefs } from '../contexts/UserPrefsContext'
import { getVehicles, deleteVehicle, getUserProfile, saveVehicle } from '../services/db'
import { fmtDist } from '../utils/units'
import './GaragePage.css'

export default function GaragePage({ onSelectVehicle, onAddVehicle, onSettings }) {
  const { user } = useAuth()
  const { prefs } = useUserPrefs()
  const [vehicles, setVehicles] = useState([])
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const photoInputRef = useRef(null)
  const photoTargetRef = useRef(null)

  const load = () => {
    Promise.all([
      getVehicles(user.uid),
      getUserProfile(user.uid),
    ]).then(([v, p]) => { setVehicles(v); setProfile(p); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (vehicleId, e) => {
    e.stopPropagation()
    if (!confirm('Remove this vehicle from your garage?')) return
    await deleteVehicle(user.uid, vehicleId)
    load()
  }

  const handlePhotoPick = (vehicleId) => {
    photoTargetRef.current = vehicleId
    photoInputRef.current?.click()
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !photoTargetRef.current) return
    e.target.value = ''

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)
      const MAX = 256
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82)

      const vehicle = vehicles.find(v => v.id === photoTargetRef.current)
      if (!vehicle) return
      await saveVehicle(user.uid, { ...vehicle, photoURL: dataUrl })
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, photoURL: dataUrl } : v))
    }
    img.src = objectUrl
  }

  const rawName = profile.displayName || user?.email?.split('@')[0]?.split('.')[0] || ''
  const greeting = rawName
    ? rawName.charAt(0).toUpperCase() + rawName.slice(1) + "'s Garage"
    : 'My Garage'

  return (
    <div className="garage-page">
      <div className="garage-header">
        <div className="garage-header-top">
          <span className="garage-wordmark">Klyp</span>
          <button className="settings-gear-btn" onClick={onSettings} title="Settings">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
        <h1 className="garage-title">{greeting}</h1>
        <p className="garage-tagline">Every service. On track.</p>
      </div>

      <div className="garage-body">
        {loading ? (
          <div className="loading">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-badge">GARAGE EMPTY</div>
            <h3>Add your first vehicle</h3>
            <p>Takes 30 seconds. We'll look up the OEM oil spec and have you tracking in no time.</p>
            <div className="empty-feature-list">
              <div className="empty-feature">🗣️ Voice logging — say it, we log it</div>
              <div className="empty-feature">📅 Due dates by mileage & time</div>
              <div className="empty-feature">📋 Full service history, always at hand</div>
            </div>
          </div>
        ) : (
          <div className="vehicle-list">
            {vehicles.map(v => (
              <div key={v.id} className="vehicle-card" onClick={() => onSelectVehicle(v)}>
                <button
                  className="vehicle-badge-wrap"
                  onClick={e => { e.stopPropagation(); handlePhotoPick(v.id) }}
                  title="Change photo"
                >
                  {v.photoURL
                    ? <img className="vehicle-badge-img" src={v.photoURL} alt="" />
                    : <div className="vehicle-badge">{v.make?.charAt(0) || 'V'}</div>
                  }
                  <span className="vehicle-badge-camera" aria-hidden="true">📷</span>
                </button>
                <div className="vehicle-info">
                  <div className="vehicle-name">
                    {v.nickname || `${v.year} ${v.make} ${v.model}`}
                  </div>
                  {v.nickname && (
                    <div className="vehicle-sub">{v.year} {v.make} {v.model}</div>
                  )}
                  <div className="vehicle-meta">
                    <span className="vehicle-mileage-chip">{fmtDist(v.currentMileage, prefs.useMetric)}</span>
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

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />

      <button className="fab" onClick={onAddVehicle}>+ Add Vehicle</button>

      <footer className="garage-footer">
        <p className="garage-footer-disclaimer">
          Vehicle specs, oil weights, and filter data are provided for reference only.
          Always verify service information with your owner's manual or a qualified technician.
        </p>
        <p className="garage-footer-copy">© {new Date().getFullYear()} Klyp. All rights reserved.</p>
      </footer>
    </div>
  )
}
