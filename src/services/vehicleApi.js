const NHTSA_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles'

// Limit to common American/popular brands to keep the list manageable
const POPULAR_MAKES = [
  'Chevrolet', 'Ford', 'GMC', 'Dodge', 'Ram', 'Jeep', 'Chrysler', 'Buick',
  'Cadillac', 'Lincoln', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia',
  'Subaru', 'Mazda', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus',
  'Acura', 'Infiniti', 'Volvo', 'Tesla',
]

export async function fetchMakes() {
  const res = await fetch(`${NHTSA_BASE}/getallmakes?format=json`)
  const data = await res.json()
  const all = data.Results.map(r => r.Make_Name)
  return all
    .filter(m => POPULAR_MAKES.some(p => p.toLowerCase() === m.toLowerCase()))
    .sort()
}

export async function fetchModels(make) {
  const res = await fetch(`${NHTSA_BASE}/getmodelsformake/${encodeURIComponent(make)}?format=json`)
  const data = await res.json()
  return [...new Set(data.Results.map(r => r.Model_Name))].sort()
}

export async function fetchYears(make, model) {
  const res = await fetch(
    `${NHTSA_BASE}/getmodelsforyearmakemodelname?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&format=json`
  )
  const data = await res.json()
  const currentYear = new Date().getFullYear() + 1
  // NHTSA doesn't reliably return years this way; generate a range
  const years = []
  for (let y = currentYear; y >= 1990; y--) years.push(y)
  return years
}
