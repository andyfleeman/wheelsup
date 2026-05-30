import { MAINTENANCE_ITEMS } from '../data/maintenanceItems'

const ICON = '/wheelsup/favicon.svg'
const THROTTLE_MS = 6 * 60 * 60 * 1000

export function checkAndScheduleNotifications(vehicles, recordsByVehicle, intervalsByVehicle, alertDays = 30) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  if (!vehicles.length) return

  const lastCheck = parseInt(localStorage.getItem('klyp_notif_last_check') || '0')
  const now = Date.now()
  if (now - lastCheck < THROTTLE_MS) return
  localStorage.setItem('klyp_notif_last_check', String(now))

  for (const vehicle of vehicles) {
    const records = recordsByVehicle[vehicle.id] || []
    const intervals = intervalsByVehicle[vehicle.id] || {}
    const name = vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`

    for (const item of MAINTENANCE_ITEMS) {
      const last = records.find(r => r.itemId === item.id)
      const intervalMiles = intervals[item.id]?.miles ?? item.defaultIntervalMiles

      if (intervalMiles && vehicle.currentMileage != null) {
        const baseMileage = last?.mileage ?? vehicle.currentMileage
        const nextMileage = baseMileage + intervalMiles
        const milesLeft = nextMileage - vehicle.currentMileage

        if (milesLeft <= 0) {
          const over = Math.abs(milesLeft)
          notify(
            `${vehicle.id}_${item.id}_overdue`,
            `${name} — ${item.label} overdue`,
            `${over.toLocaleString()} mi past due. Open Klyp to log it.`
          )
          clearFlag(`klyp_notif_${vehicle.id}_${item.id}_soon`)
        } else if (vehicle.dailyMiles) {
          const days = Math.round(milesLeft / vehicle.dailyMiles)
          const alertMiles = alertDays * vehicle.dailyMiles
          if (milesLeft <= alertMiles) {
            notify(
              `${vehicle.id}_${item.id}_soon`,
              `${name} — ${item.label} coming due`,
              `Due in ~${milesLeft.toLocaleString()} miles — about ${days} day${days !== 1 ? 's' : ''} from now.`
            )
          } else {
            clearFlag(`klyp_notif_${vehicle.id}_${item.id}_soon`)
            clearFlag(`klyp_notif_${vehicle.id}_${item.id}_overdue`)
          }
        }
      }

      if (item.defaultIntervalMonths && last?.date) {
        const dueDate = new Date(last.date)
        dueDate.setMonth(dueDate.getMonth() + item.defaultIntervalMonths)
        const msLeft = dueDate - now
        const daysLeft = Math.round(msLeft / (1000 * 60 * 60 * 24))

        if (daysLeft <= 0) {
          notify(
            `${vehicle.id}_${item.id}_time_overdue`,
            `${name} — ${item.label} overdue`,
            `Past the ${item.defaultIntervalMonths}-month service interval. Log it when done.`
          )
        } else if (daysLeft <= alertDays) {
          notify(
            `${vehicle.id}_${item.id}_time_soon`,
            `${name} — ${item.label} due soon`,
            `Due in about ${daysLeft} day${daysLeft !== 1 ? 's' : ''} (time-based interval).`
          )
        } else {
          clearFlag(`klyp_notif_${vehicle.id}_${item.id}_time_soon`)
          clearFlag(`klyp_notif_${vehicle.id}_${item.id}_time_overdue`)
        }
      }
    }
  }
}

function notify(key, title, body) {
  const storageKey = `klyp_notif_${key}`
  if (localStorage.getItem(storageKey)) return
  try {
    new Notification(title, { body, icon: ICON, tag: storageKey })
    localStorage.setItem(storageKey, String(Date.now()))
  } catch (_) {}
}

function clearFlag(storageKey) {
  localStorage.removeItem(storageKey)
}

export function clearServiceNotifications(vehicleId, itemId) {
  ['overdue', 'soon', 'time_overdue', 'time_soon'].forEach(t =>
    localStorage.removeItem(`klyp_notif_${vehicleId}_${itemId}_${t}`)
  )
}
