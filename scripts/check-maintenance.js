import admin from 'firebase-admin'
import { Resend } from 'resend'

const db = initFirebase()
const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFY_DAYS_AHEAD = 7    // warn this many days before estimated due date
const NOTIFY_COOLDOWN_DAYS = 5 // don't re-notify within this window

const MAINTENANCE_ITEMS = [
  { id: 'oil_change',         label: 'Oil Change',          icon: '🛢️', defaultIntervalMiles: 5000,  defaultIntervalMonths: 6  },
  { id: 'tire_rotation',      label: 'Tire Rotation',       icon: '🔄', defaultIntervalMiles: 7500,  defaultIntervalMonths: 6  },
  { id: 'air_filter',         label: 'Engine Air Filter',   icon: '💨', defaultIntervalMiles: 20000, defaultIntervalMonths: 24 },
  { id: 'cabin_air_filter',   label: 'Cabin Air Filter',    icon: '🌬️', defaultIntervalMiles: 15000, defaultIntervalMonths: 12 },
  { id: 'battery',            label: 'Battery',             icon: '🔋', defaultIntervalMiles: null,  defaultIntervalMonths: 48 },
  { id: 'brake_fluid',        label: 'Brake Fluid',         icon: '🛑', defaultIntervalMiles: 30000, defaultIntervalMonths: 24 },
  { id: 'transmission_fluid', label: 'Transmission Fluid',  icon: '⚙️', defaultIntervalMiles: 45000, defaultIntervalMonths: 36 },
  { id: 'coolant_flush',      label: 'Coolant Flush',       icon: '🌡️', defaultIntervalMiles: 50000, defaultIntervalMonths: 60 },
  { id: 'spark_plugs',        label: 'Spark Plugs',         icon: '⚡', defaultIntervalMiles: 30000, defaultIntervalMonths: 36 },
  { id: 'wiper_blades',       label: 'Wiper Blades',        icon: '🌧️', defaultIntervalMiles: 12000, defaultIntervalMonths: 12 },
]

function initFirebase() {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  return admin.firestore()
}

async function getLastRecords(uid, vehicleId) {
  const snap = await db
    .collection('users').doc(uid)
    .collection('vehicles').doc(vehicleId)
    .collection('records')
    .orderBy('createdAt', 'desc')
    .get()
  const last = {}
  snap.docs.forEach(d => {
    const r = d.data()
    if (!last[r.itemId]) last[r.itemId] = r
  })
  return last
}

async function getCustomIntervals(uid, vehicleId) {
  const snap = await db
    .collection('users').doc(uid)
    .collection('vehicles').doc(vehicleId)
    .collection('intervals')
    .get()
  const result = {}
  snap.docs.forEach(d => { result[d.id] = d.data() })
  return result
}

async function getLastNotified(uid, vehicleId, itemId) {
  const ref = await db
    .collection('users').doc(uid)
    .collection('vehicles').doc(vehicleId)
    .collection('notifications').doc(itemId)
    .get()
  return ref.exists ? ref.data().sentAt?.toDate() : null
}

async function markNotified(uid, vehicleId, itemId) {
  await db
    .collection('users').doc(uid)
    .collection('vehicles').doc(vehicleId)
    .collection('notifications').doc(itemId)
    .set({ sentAt: admin.firestore.FieldValue.serverTimestamp() })
}

// Returns { daysOut, overdue, reason, nextMileage, timeDueDate } or null if no threshold applies
function calcDueInfo(item, last, vehicle, customIntervals, today) {
  let mileageDaysOut = Infinity
  let mileageOverdue = false
  let nextMileage = null

  // Mileage threshold
  if (item.defaultIntervalMiles && vehicle.currentMileage) {
    const intervalMiles = customIntervals[item.id]?.miles ?? item.defaultIntervalMiles
    const baseMileage = last?.mileage ?? vehicle.currentMileage
    nextMileage = baseMileage + intervalMiles
    const milesRemaining = nextMileage - vehicle.currentMileage

    if (milesRemaining <= 0) {
      mileageDaysOut = 0
      mileageOverdue = true
    } else if (vehicle.dailyMiles) {
      mileageDaysOut = Math.round(milesRemaining / vehicle.dailyMiles)
    }
    // If no dailyMiles, mileageDaysOut stays Infinity — can't estimate
  }

  // Time threshold — requires a logged service date to anchor from
  let timeDaysOut = Infinity
  let timeOverdue = false
  let timeDueDate = null

  if (item.defaultIntervalMonths && last?.date) {
    timeDueDate = new Date(last.date)
    timeDueDate.setMonth(timeDueDate.getMonth() + item.defaultIntervalMonths)
    const msRemaining = timeDueDate - today
    timeDaysOut = Math.round(msRemaining / (1000 * 60 * 60 * 24))
    if (timeDaysOut <= 0) timeOverdue = true
  }

  // Both thresholds unknown — nothing to report
  if (mileageDaysOut === Infinity && timeDaysOut === Infinity) return null

  // Use whichever fires first
  const useMileage = mileageDaysOut <= timeDaysOut
  const daysOut = useMileage ? mileageDaysOut : timeDaysOut
  const overdue = useMileage ? mileageOverdue : timeOverdue

  return {
    daysOut: Math.max(0, daysOut),
    overdue,
    reason: useMileage ? 'mileage' : 'time',
    nextMileage: useMileage ? nextMileage : null,
    timeDueDate: !useMileage ? timeDueDate : null,
  }
}

function buildEmailHtml(userName, dueItems) {
  const rows = dueItems.map(d => {
    let rightCol
    if (d.overdue) {
      rightCol = `<span style="color:#d32f2f;font-weight:600">Overdue</span>`
    } else if (d.reason === 'time') {
      const dateStr = d.timeDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      rightCol = `
        <span style="color:#f57c00;font-weight:600">~${d.daysOut} day${d.daysOut === 1 ? '' : 's'}</span><br/>
        <span style="color:#888;font-size:0.85em">by ${dateStr} (time limit)</span>`
    } else {
      rightCol = `
        <span style="color:#f57c00;font-weight:600">~${d.daysOut} day${d.daysOut === 1 ? '' : 's'}</span><br/>
        <span style="color:#888;font-size:0.85em">${d.nextMileage.toLocaleString()} mi</span>`
    }

    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:1.2em">${d.icon}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0">
          <strong>${d.vehicle}</strong><br/>
          <span style="color:#555">${d.label}</span>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap">
          ${rightCol}
        </td>
      </tr>`
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f7fa">
      <div style="max-width:480px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:24px;text-align:center">
          <div style="font-size:2.5em">🚗</div>
          <h1 style="color:white;margin:8px 0 4px;font-size:1.4em">WheelsUp</h1>
          <p style="color:rgba(255,255,255,0.85);margin:0;font-size:0.9em">Vehicle Maintenance Reminder</p>
        </div>
        <div style="padding:24px">
          <p style="color:#333;margin:0 0 16px">Hi ${userName || 'there'},</p>
          <p style="color:#333;margin:0 0 20px">
            ${dueItems.length === 1 ? 'One of your vehicles has' : 'Some of your vehicles have'}
            maintenance due soon:
          </p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">
            ${rows}
          </table>
          <p style="color:#888;font-size:0.8em;margin:20px 0 0;text-align:center">
            Open WheelsUp to log your service and reset the interval.
          </p>
        </div>
      </div>
    </body>
    </html>`
}

async function run() {
  const usersSnap = await db.collection('users').get()
  const today = new Date()

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id
    const { email } = userDoc.data()
    if (!email) continue

    const vehiclesSnap = await db.collection('users').doc(uid).collection('vehicles').get()
    const dueItems = []

    for (const vehicleDoc of vehiclesSnap.docs) {
      const vehicle = vehicleDoc.data()
      const vehicleId = vehicleDoc.id

      const [lastRecords, customIntervals] = await Promise.all([
        getLastRecords(uid, vehicleId),
        getCustomIntervals(uid, vehicleId),
      ])

      const vehicleLabel = vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`

      for (const item of MAINTENANCE_ITEMS) {
        const last = lastRecords[item.id]
        const info = calcDueInfo(item, last, vehicle, customIntervals, today)

        if (!info) continue
        if (!info.overdue && info.daysOut > NOTIFY_DAYS_AHEAD) continue

        // Cooldown check — don't spam
        const lastNotified = await getLastNotified(uid, vehicleId, item.id)
        if (lastNotified) {
          const daysSince = (today - lastNotified) / (1000 * 60 * 60 * 24)
          if (daysSince < NOTIFY_COOLDOWN_DAYS) continue
        }

        dueItems.push({
          vehicle: vehicleLabel,
          label: item.label,
          icon: item.icon,
          ...info,
          uid,
          vehicleId,
          itemId: item.id,
        })
      }
    }

    if (dueItems.length === 0) continue

    const userName = email.split('@')[0]
    const subject = dueItems.some(d => d.overdue)
      ? `⚠️ Overdue maintenance on your vehicle`
      : `🔧 Maintenance due soon — WheelsUp`

    await resend.emails.send({
      from: 'WheelsUp <onboarding@resend.dev>',
      to: email,
      subject,
      html: buildEmailHtml(userName, dueItems),
    })

    console.log(`Sent notification to ${email} for ${dueItems.length} item(s)`)

    await Promise.all(dueItems.map(d => markNotified(d.uid, d.vehicleId, d.itemId)))
  }

  console.log('Done.')
}

run().catch(err => { console.error(err); process.exit(1) })
