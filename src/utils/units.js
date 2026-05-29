const KM_PER_MI = 1.60934

// Format stored miles value for display (includes unit label)
export function fmtDist(miles, useMetric) {
  if (miles == null || miles === '') return ''
  if (useMetric) return `${Math.round(miles * KM_PER_MI).toLocaleString()} km`
  return `${Math.round(miles).toLocaleString()} mi`
}

// Convert display-unit input value back to miles for storage
export function toMiles(displayValue, useMetric) {
  const n = Number(displayValue)
  if (!n || isNaN(n)) return 0
  return useMetric ? Math.round(n / KM_PER_MI) : n
}

// Convert stored miles to display value for input fields (no label)
export function fromMiles(storedMiles, useMetric) {
  if (!storedMiles) return ''
  return useMetric ? Math.round(storedMiles * KM_PER_MI) : storedMiles
}

// Just the unit label
export function distUnit(useMetric) {
  return useMetric ? 'km' : 'mi'
}
