import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserPrefs } from '../contexts/UserPrefsContext'
import { fmtDist, fromMiles, toMiles } from '../utils/units'
import { MAINTENANCE_ITEMS } from '../data/maintenanceItems'
import {
  saveMaintenanceRecord, getMaintenanceRecords, deleteMaintenanceRecord,
  saveInterval, getIntervals, saveVehicle,
  saveFuelRecord, getFuelRecords, deleteFuelRecord,
} from '../services/db'
import { checkAndScheduleNotifications, clearServiceNotifications } from '../utils/notifications'
import MaintenanceCard from '../components/MaintenanceCard'
import LogServiceModal from '../components/LogServiceModal'
import RepairLogModal from '../components/RepairLogModal'
import FuelLogModal from '../components/FuelLogModal'
import VoiceLogger from '../components/VoiceLogger'
import LogbookPage from './LogbookPage'
import FuelTab from './FuelTab'
import './VehicleDashboard.css'

export default function VehicleDashboard({ vehicle, onBack, onEdit }) {
  const { user } = useAuth()
  const { prefs } = useUserPrefs()
  const [records, setRecords]               = useState([])
  const [intervals, setIntervals]           = useState({})
  const [fuelRecords, setFuelRecords]       = useState([])
  const [currentMileage, setCurrentMileage] = useState(vehicle.currentMileage)
  const [editingMileage, setEditingMileage] = useState(false)
  const [mileageInput, setMileageInput]     = useState(vehicle.currentMileage)
  const [logItem, setLogItem]               = useState(null)
  const [resetItem, setResetItem]           = useState(null)
  const [showRepairModal, setShowRepairModal] = useState(false)
  const [showFuelModal, setShowFuelModal]   = useState(false)
  const [voiceActive, setVoiceActive]       = useState(false)
  const [tab, setTab]                       = useState('schedule')

  useEffect(() => {
    Promise.all([
      getMaintenanceRecords(user.uid, vehicle.id),
      getIntervals(user.uid, vehicle.id),
    ]).then(([recs, ivs]) => {
      setRecords(recs)
      setIntervals(ivs)
    })
  }, [user.uid, vehicle.id])

  // Load fuel records lazily when fuel tab is first opened
  useEffect(() => {
    if (tab === 'fuel' && fuelRecords.length === 0) {
      getFuelRecords(user.uid, vehicle.id).then(setFuelRecords)
    }
  }, [tab])

  // Fire due-service notifications after data loads
  useEffect(() => {
    if (!records.length && !Object.keys(intervals).length) return
    const alertDays = 30
    checkAndScheduleNotifications(
      [{ ...vehicle, currentMileage }],
      { [vehicle.id]: records },
      { [vehicle.id]: intervals },
      alertDays
    )
  }, [records, intervals])

  const getLastRecord = (itemId) => records.find(r => r.itemId === itemId && r.type !== 'repair')

  const getInterval = (item) => intervals[item.id]?.miles ?? item.defaultIntervalMiles

  const getNextMileage = (item) => {
    const last = getLastRecord(item.id)
    const interval = getInterval(item)
    if (!interval) return null
    const baseMileage = last?.mileage ?? currentMileage
    return baseMileage + interval
  }

  const getDueInfo = (item) => {
    const last = getLastRecord(item.id)

    let mileageDate = null
    if (vehicle.dailyMiles) {
      const next = getNextMileage(item)
      if (next) {
        const milesRemaining = next - currentMileage
        if (milesRemaining > 0) {
          mileageDate = new Date()
          mileageDate.setDate(mileageDate.getDate() + Math.round(milesRemaining / vehicle.dailyMiles))
        }
      }
    }

    let timeDate = null
    if (item.defaultIntervalMonths && last?.date) {
      timeDate = new Date(last.date)
      timeDate.setMonth(timeDate.getMonth() + item.defaultIntervalMonths)
    }

    if (!mileageDate && !timeDate) return { estimatedDate: null, reason: null }
    if (!mileageDate) return { estimatedDate: timeDate, reason: 'time' }
    if (!timeDate)    return { estimatedDate: mileageDate, reason: 'mileage' }
    return mileageDate <= timeDate
      ? { estimatedDate: mileageDate, reason: 'mileage' }
      : { estimatedDate: timeDate,   reason: 'time' }
  }

  const getOverdueItems = () => {
    const today = new Date()
    return visibleItems.filter(item => {
      const next = getNextMileage(item)
      if (next && currentMileage >= next) return true
      const last = getLastRecord(item.id)
      if (item.defaultIntervalMonths && last?.date) {
        const dueDate = new Date(last.date)
        dueDate.setMonth(dueDate.getMonth() + item.defaultIntervalMonths)
        if (today >= dueDate) return true
      }
      return false
    })
  }

  const handleUpdateMileage = async () => {
    const val = toMiles(mileageInput, prefs.useMetric)
    if (!val || val < 0) return
    setCurrentMileage(val)
    setEditingMileage(false)
    await saveVehicle(user.uid, { ...vehicle, currentMileage: val })
  }

  const handleIntervalChange = async (itemId, miles) => {
    setIntervals(prev => ({ ...prev, [itemId]: { miles } }))
    await saveInterval(user.uid, vehicle.id, itemId, { miles })
  }

  const handleDeleteRecord = async (recordId) => {
    await deleteMaintenanceRecord(user.uid, vehicle.id, recordId)
    const fresh = await getMaintenanceRecords(user.uid, vehicle.id)
    setRecords(fresh)
  }

  const handleLogService = async (record) => {
    await saveMaintenanceRecord(user.uid, vehicle.id, record)
    if (record.itemId && record.itemId !== 'repair') {
      clearServiceNotifications(vehicle.id, record.itemId)
    }
    const fresh = await getMaintenanceRecords(user.uid, vehicle.id)
    setRecords(fresh)
    if (record.mileage > currentMileage) {
      setCurrentMileage(record.mileage)
      await saveVehicle(user.uid, { ...vehicle, currentMileage: record.mileage })
    }
    setLogItem(null)
    setResetItem(null)
    setShowRepairModal(false)
  }

  const handleVoiceConfirm = async ({ services, mileage }) => {
    const resolvedMileage = (mileage != null) ? mileage : currentMileage
    for (const serviceId of services) {
      const item = MAINTENANCE_ITEMS.find(i => i.id === serviceId)
      if (!item) continue
      await handleLogService({
        itemId:    serviceId,
        itemLabel: item.label,
        type:      'service',
        mileage:   resolvedMileage,
        date:      new Date().toISOString(),
        notes:     'Logged via voice',
        cost:      null,
        subItems:  [],
      })
    }
    setVoiceActive(false)
  }

  const handleSaveFuel = async (record) => {
    await saveFuelRecord(user.uid, vehicle.id, record)
    const fresh = await getFuelRecords(user.uid, vehicle.id)
    setFuelRecords(fresh)
    if (record.mileage > currentMileage) {
      setCurrentMileage(record.mileage)
      await saveVehicle(user.uid, { ...vehicle, currentMileage: record.mileage })
    }
    setShowFuelModal(false)
  }

  const handleDeleteFuel = async (recordId) => {
    await deleteFuelRecord(user.uid, vehicle.id, recordId)
    const fresh = await getFuelRecords(user.uid, vehicle.id)
    setFuelRecords(fresh)
  }

  const visibleItems = MAINTENANCE_ITEMS.filter(
    item => !(prefs.hiddenServices ?? []).includes(item.id)
  )

  const vehicleLabel = vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  const serviceRecords = records.filter(r => r.type !== 'repair')
  const repairRecords  = records.filter(r => r.type === 'repair')
  const allLogbookRecords = records

  return (
    <div className="vehicle-dashboard">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        {vehicle.photoURL && (
          <img className="header-vehicle-photo" src={vehicle.photoURL} alt="" />
        )}
        <div className="header-title">
          <h2>{vehicleLabel}</h2>
          {vehicle.nickname && (
            <span className="header-sub">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          )}
        </div>
        <button className="edit-vehicle-btn" onClick={onEdit} title="Edit vehicle">Edit</button>
      </div>

      <div className="vehicle-strip">
        <div className="vehicle-strip-left">
          {(vehicle.oilWeight || vehicle.filterPartNumber) && (
            <>
              {vehicle.oilWeight && (
                <span className="oil-spec-chip">
                  <span className="oil-spec-chip-label">Oil</span>
                  {vehicle.oilWeight}
                </span>
              )}
              {vehicle.filterPartNumber && (
                <span className="oil-spec-chip">
                  <span className="oil-spec-chip-label">Filter</span>
                  {vehicle.filterPartNumber}
                </span>
              )}
            </>
          )}
        </div>
        {editingMileage ? (
          <div className="mileage-edit-inline">
            <input
              type="number"
              value={mileageInput}
              onChange={e => setMileageInput(e.target.value)}
              autoFocus
            />
            <button onClick={handleUpdateMileage}>Save</button>
            <button onClick={() => setEditingMileage(false)}>✕</button>
          </div>
        ) : (
          <button
            className="mileage-chip"
            onClick={() => { setMileageInput(fromMiles(currentMileage, prefs.useMetric)); setEditingMileage(true) }}
          >
            <span className="mileage-chip-label">{prefs.useMetric ? 'KM' : 'MI'}</span>
            <span className="mileage-chip-value">{fmtDist(currentMileage, prefs.useMetric)}</span>
            <span className="mileage-chip-edit">✎</span>
          </button>
        )}
      </div>

      {(() => {
        const overdue = getOverdueItems()
        if (!overdue.length) return null
        return (
          <div className="overdue-banner">
            <div className="overdue-banner-title">
              {overdue.length === 1
                ? '1 SERVICE OVERDUE — don\'t wait'
                : `${overdue.length} SERVICES OVERDUE — action needed`}
            </div>
            <div className="overdue-banner-items">
              {overdue.map(item => {
                const next = getNextMileage(item)
                const milesOver = next ? currentMileage - next : null
                const { estimatedDate } = getDueInfo(item)
                const daysOver = estimatedDate
                  ? Math.round((new Date() - estimatedDate) / (1000 * 60 * 60 * 24))
                  : null
                return (
                  <button
                    key={item.id}
                    className="overdue-banner-item"
                    onClick={() => { setLogItem(item); setTab('schedule') }}
                  >
                    <span>{item.label}</span>
                    <span className="overdue-detail">
                      {milesOver > 0
                        ? `${fmtDist(milesOver, prefs.useMetric)} past due`
                        : daysOver > 0
                          ? `${daysOver} day${daysOver !== 1 ? 's' : ''} past due`
                          : 'time limit reached'
                      } · Log now →
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })()}

      <div className="dashboard-tabs">
        <button
          className={`dash-tab ${tab === 'schedule' ? 'active' : ''}`}
          onClick={() => setTab('schedule')}
        >
          Schedule
        </button>
        <button
          className={`dash-tab ${tab === 'logbook' ? 'active' : ''}`}
          onClick={() => setTab('logbook')}
        >
          Logbook {allLogbookRecords.length > 0 && <span className="tab-badge">{allLogbookRecords.length}</span>}
        </button>
        <button
          className={`dash-tab ${tab === 'fuel' ? 'active' : ''}`}
          onClick={() => setTab('fuel')}
        >
          Fuel {fuelRecords.length > 0 && <span className="tab-badge">{fuelRecords.length}</span>}
        </button>
      </div>

      {tab === 'schedule' && (
        <div className="cards-list">
          <button
            className="voice-log-btn"
            onClick={() => setVoiceActive(true)}
            title="Log services by voice"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="2" width="6" height="13" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="9" y1="21" x2="15" y2="21" />
            </svg>
            Say it, we log it →
          </button>
          {visibleItems.map(item => (
            <MaintenanceCard
              key={item.id}
              item={item}
              lastRecord={getLastRecord(item.id)}
              nextMileage={getNextMileage(item)}
              currentMileage={currentMileage}
              intervalMiles={getInterval(item)}
              dueInfo={getDueInfo(item)}
              useMetric={prefs.useMetric}
              onIntervalChange={(miles) => handleIntervalChange(item.id, miles)}
              onLog={() => setLogItem(item)}
              onReset={item.resetAction ? () => setResetItem(item) : undefined}
            />
          ))}
          <button
            className="repair-log-btn"
            onClick={() => setShowRepairModal(true)}
          >
            + Log a Repair or Shop Visit
          </button>
        </div>
      )}

      {tab === 'logbook' && (
        <LogbookPage
          vehicle={{ ...vehicle, currentMileage }}
          records={allLogbookRecords}
          onDeleteRecord={handleDeleteRecord}
          onLogRepair={() => setShowRepairModal(true)}
        />
      )}

      {tab === 'fuel' && (
        <FuelTab
          records={fuelRecords}
          useMetric={prefs.useMetric}
          onAddFuel={() => setShowFuelModal(true)}
          onDeleteFuel={handleDeleteFuel}
        />
      )}

      {logItem && (
        <LogServiceModal
          item={logItem}
          currentMileage={currentMileage}
          oilWeight={vehicle.oilWeight}
          filterPartNumber={vehicle.filterPartNumber}
          useMetric={prefs.useMetric}
          onSave={handleLogService}
          onClose={() => setLogItem(null)}
          resetMode={false}
        />
      )}

      {resetItem && (
        <LogServiceModal
          item={resetItem}
          currentMileage={currentMileage}
          useMetric={prefs.useMetric}
          onSave={handleLogService}
          onClose={() => setResetItem(null)}
          resetMode={true}
        />
      )}

      {showRepairModal && (
        <RepairLogModal
          currentMileage={currentMileage}
          useMetric={prefs.useMetric}
          onSave={handleLogService}
          onClose={() => setShowRepairModal(false)}
        />
      )}

      {showFuelModal && (
        <FuelLogModal
          currentMileage={currentMileage}
          useMetric={prefs.useMetric}
          onSave={handleSaveFuel}
          onClose={() => setShowFuelModal(false)}
        />
      )}

      <VoiceLogger
        active={voiceActive}
        currentMileage={currentMileage}
        useMetric={prefs.useMetric}
        onConfirm={handleVoiceConfirm}
        onClose={() => setVoiceActive(false)}
      />
    </div>
  )
}
