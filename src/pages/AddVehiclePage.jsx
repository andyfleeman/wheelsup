import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MAKES, getModels, getYears } from '../data/vehicles.js'
import { saveVehicle } from '../services/db'
import { ENGINE_TYPES } from '../data/maintenanceItems'
import { lookupOilSpec, filterSearchUrl } from '../data/vehicleSpecs'
import { playCarFlyby } from '../utils/sounds'
import './AddVehiclePage.css'

const YEARS = getYears()

export default function AddVehiclePage({ onSaved, onCancel, existing }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    make: '', model: '', year: '', engineType: '',
    currentMileage: '', dailyMiles: '', nickname: '',
    oilWeight: '', filterPartNumber: '',
    ...(existing || {}),
  })
  const [saving, setSaving] = useState(false)
  const [oilAutoFilled, setOilAutoFilled] = useState(false)

  const models = form.make ? getModels(form.make) : []
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  // Auto-populate oil weight from local OEM database when vehicle identity changes
  useEffect(() => {
    if (existing) return
    if (!form.make || !form.model || !form.year) return
    const spec = lookupOilSpec(form.make, form.model, form.year)
    if (spec?.oil) {
      setForm(f => ({ ...f, oilWeight: spec.oil }))
      setOilAutoFilled(true)
    } else {
      setOilAutoFilled(false)
    }
  }, [form.make, form.model, form.year])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.make || !form.model || !form.year || !form.currentMileage) return
    setSaving(true)
    try {
      await saveVehicle(user.uid, {
        ...form,
        currentMileage: Number(form.currentMileage),
        dailyMiles: form.dailyMiles ? Number(form.dailyMiles) : null,
        year: Number(form.year),
      })
      if (!existing) playCarFlyby()
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  const dbSpec = (form.make && form.model && form.year)
    ? lookupOilSpec(form.make, form.model, form.year)
    : null

  const filterUrl = (form.make && form.model && form.year)
    ? filterSearchUrl(form.year, form.make, form.model, form.engineType)
    : null

  return (
    <div className="add-vehicle-page">
      <div className="page-header">
        <button className="back-btn" onClick={onCancel}>←</button>
        <h2>{existing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
      </div>

      <form className="vehicle-form" onSubmit={handleSubmit}>
        <label>
          Nickname (optional)
          <input
            type="text"
            placeholder="e.g. Work Truck"
            value={form.nickname}
            onChange={e => set('nickname', e.target.value)}
          />
        </label>

        <label>
          Year *
          <select value={form.year} onChange={e => set('year', e.target.value)} required>
            <option value="">Select year...</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>

        <label>
          Make *
          <select value={form.make} onChange={e => { set('make', e.target.value); set('model', '') }} required>
            <option value="">Select make...</option>
            {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <label>
          Model *
          <select value={form.model} onChange={e => set('model', e.target.value)} required disabled={!form.make}>
            <option value="">{form.make ? 'Select model...' : 'Select make first'}</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <label>
          Engine Type
          <select value={form.engineType} onChange={e => set('engineType', e.target.value)}>
            <option value="">Select engine type...</option>
            {ENGINE_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </label>

        <label>
          Current Mileage *
          <input
            type="number"
            placeholder="e.g. 150000"
            value={form.currentMileage}
            onChange={e => set('currentMileage', e.target.value)}
            min="0"
            required
          />
        </label>

        <label>
          Average Daily Miles
          <input
            type="number"
            placeholder="e.g. 62"
            value={form.dailyMiles}
            onChange={e => set('dailyMiles', e.target.value)}
            min="1"
          />
          <span className="field-hint">Used to estimate your next service date</span>
        </label>

        {/* Oil & Filter section — appears once year/make/model are selected */}
        {(form.make && form.model && form.year) && (
          <div className="oil-spec-section">
            <div className="oil-spec-section-title">Oil &amp; Filter</div>

            <label>
              Oil Weight
              <div className="oil-weight-row">
                <input
                  type="text"
                  placeholder="e.g. 0W-20"
                  value={form.oilWeight}
                  onChange={e => { set('oilWeight', e.target.value); setOilAutoFilled(false) }}
                  className="oil-weight-input"
                />
                {oilAutoFilled && <span className="auto-badge">Auto-filled</span>}
              </div>
              {dbSpec?.qt ? (
                <span className="field-hint">
                  {oilAutoFilled ? 'Looked up from OEM specs · ' : ''}Capacity: ~{dbSpec.qt} qt — verify with owner's manual
                </span>
              ) : (
                <span className="field-hint">Check your oil cap or owner's manual</span>
              )}
            </label>

            <label>
              Filter Part #
              <div className="filter-row">
                <input
                  type="text"
                  placeholder="e.g. Fram PH2, Wix 51069"
                  value={form.filterPartNumber}
                  onChange={e => set('filterPartNumber', e.target.value)}
                  className="filter-input"
                />
                {filterUrl && (
                  <a
                    href={filterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="filter-search-btn"
                  >
                    Find ↗
                  </a>
                )}
              </div>
              <span className="field-hint">Save once — shown every time you log an oil change</span>
            </label>
          </div>
        )}

        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Saving...' : existing ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </form>
    </div>
  )
}
