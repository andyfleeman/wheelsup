import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MAKES, getModels, getYears } from '../data/vehicles.js'
import { saveVehicle } from '../services/db'
import { ENGINE_TYPES, getOilSpec } from '../data/maintenanceItems'
import { playCarFlyby } from '../utils/sounds'
import './AddVehiclePage.css'

const YEARS = getYears()

export default function AddVehiclePage({ onSaved, onCancel, existing }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    make: '', model: '', year: '', engineType: '',
    currentMileage: '', dailyMiles: '', nickname: '',
    ...(existing || {}),
  })
  const [saving, setSaving] = useState(false)

  const models = form.make ? getModels(form.make) : []
  const oilSpec = form.make && form.engineType ? getOilSpec(form.make, form.engineType) : null
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

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

        {oilSpec && (
          <div className="oil-spec-hint">
            <span className="oil-spec-label">Recommended Oil</span>
            <span className="oil-spec-value">{oilSpec}</span>
            <span className="oil-spec-note">Always verify with your owner's manual</span>
          </div>
        )}

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

        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Saving...' : existing ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </form>
    </div>
  )
}
