import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MAINTENANCE_ITEMS } from '../data/maintenanceItems'
import { saveMaintenanceRecord, getMaintenanceRecords, saveInterval, getIntervals, saveVehicle } from '../services/db'
import MaintenanceCard from '../components/MaintenanceCard'
import LogServiceModal from '../components/LogServiceModal'
import './VehicleDashboard.css'

export default function VehicleDashboard({ vehicle, onBack, onEdit }) {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [intervals, setIntervals] = useState({})
  const [currentMileage, setCurrentMileage] = useState(vehicle.currentMileage)
  const [editingMileage, setEditingMileage] = useState(false)
  const [mileageInput, setMileageInput] = useState(vehicle.currentMileage)
  const [logItem, setLogItem] = useState(null)

  useEffect(() => {
    getMaintenanceRecords(user.uid, vehicle.id).then(setRecords)
    getIntervals(user.uid, vehicle.id).then(setIntervals)
  }, [user.uid, vehicle.id])

  const getLastRecord = (itemId) =>
    records.find(r => r.itemId === itemId)

  const getInterval = (item) =>
    intervals[item.id]?.miles ?? item.defaultIntervalMiles

  const getNextMileage = (item) => {
    const last = getLastRecord(item.id)
    const interval = getInterval(item)
    if (!interval) return null
    const baseMileage = last?.mileage ?? currentMileage
    return baseMileage + interval
  }

  const handleUpdateMileage = async () => {
    const val = Number(mileageInput)
    if (!val || val < 0) return
    setCurrentMileage(val)
    setEditingMileage(false)
    await saveVehicle(user.uid, { ...vehicle, currentMileage: val })
  }

  const handleIntervalChange = async (itemId, miles) => {
    const updated = { ...intervals, [itemId]: { miles } }
    setIntervals(updated)
    await saveInterval(user.uid, vehicle.id, itemId, { miles })
  }

  const handleLogService = async (record) => {
    await saveMaintenanceRecord(user.uid, vehicle.id, record)
    const fresh = await getMaintenanceRecords(user.uid, vehicle.id)
    setRecords(fresh)
    if (record.mileage > currentMileage) {
      setCurrentMileage(record.mileage)
      await saveVehicle(user.uid, { ...vehicle, currentMileage: record.mileage })
    }
    setLogItem(null)
  }

  const vehicleLabel = vehicle.nickname
    ? vehicle.nickname
    : `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  return (
    <div className="vehicle-dashboard">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="header-title">
          <h2>{vehicleLabel}</h2>
          {vehicle.nickname && (
            <span className="header-sub">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          )}
        </div>
        <button className="edit-vehicle-btn" onClick={onEdit} title="Edit vehicle">✏️</button>
      </div>

      <div className="mileage-banner">
        {editingMileage ? (
          <div className="mileage-edit">
            <input
              type="number"
              value={mileageInput}
              onChange={e => setMileageInput(e.target.value)}
              autoFocus
            />
            <button onClick={handleUpdateMileage}>Save</button>
            <button onClick={() => setEditingMileage(false)}>Cancel</button>
          </div>
        ) : (
          <div className="mileage-display" onClick={() => { setMileageInput(currentMileage); setEditingMileage(true) }}>
            <span className="mileage-label">Current Mileage</span>
            <span className="mileage-value">{currentMileage.toLocaleString()} mi</span>
            <span className="mileage-tap">tap to update</span>
          </div>
        )}
      </div>

      <div className="cards-list">
        {MAINTENANCE_ITEMS.map(item => (
          <MaintenanceCard
            key={item.id}
            item={item}
            lastRecord={getLastRecord(item.id)}
            nextMileage={getNextMileage(item)}
            currentMileage={currentMileage}
            intervalMiles={getInterval(item)}
            onIntervalChange={(miles) => handleIntervalChange(item.id, miles)}
            onLog={() => setLogItem(item)}
          />
        ))}
      </div>

      {logItem && (
        <LogServiceModal
          item={logItem}
          currentMileage={currentMileage}
          onSave={handleLogService}
          onClose={() => setLogItem(null)}
        />
      )}
    </div>
  )
}
