export const MAINTENANCE_ITEMS = [
  {
    id: 'oil_change',
    label: 'Oil Change',
    icon: '🛢️',
    defaultIntervalMiles: 5000,
    defaultIntervalMonths: 6,
    unit: 'miles',
    description: 'Engine oil & filter replacement',
  },
  {
    id: 'tire_rotation',
    label: 'Tire Rotation',
    icon: '🔄',
    defaultIntervalMiles: 7500,
    defaultIntervalMonths: 6,
    unit: 'miles',
    description: 'Rotate tires for even wear',
  },
  {
    id: 'air_filter',
    label: 'Air Filter',
    icon: '💨',
    defaultIntervalMiles: 20000,
    defaultIntervalMonths: 24,
    unit: 'miles',
    description: 'Engine air filter replacement',
  },
  {
    id: 'battery',
    label: 'Battery',
    icon: '🔋',
    defaultIntervalMiles: null,
    defaultIntervalMonths: 48,
    unit: 'months',
    description: 'Battery inspection/replacement',
  },
  {
    id: 'transmission_fluid',
    label: 'Transmission Fluid',
    icon: '⚙️',
    defaultIntervalMiles: 45000,
    defaultIntervalMonths: 36,
    unit: 'miles',
    description: 'Transmission fluid change',
  },
]

// Oil type recommendations by engine type
export const OIL_RECOMMENDATIONS = {
  default: {
    conventional: { viscosity: '5W-30', type: 'Conventional', notes: 'Standard recommendation' },
    synthetic: { viscosity: '5W-30', type: 'Full Synthetic', notes: 'Extended drain interval' },
  },
  diesel: { viscosity: '15W-40', type: 'Diesel', notes: 'CK-4 rated diesel oil required' },
}

// Common engine types
export const ENGINE_TYPES = [
  '4-Cylinder (Gas)',
  '6-Cylinder (Gas)',
  '8-Cylinder (Gas)',
  'Diesel',
  'Hybrid',
  'Electric',
  'Turbocharged 4-Cylinder',
  'Turbocharged 6-Cylinder',
]

// Oil spec lookup by make/engine — covers the most common combos
export const OIL_SPECS = {
  Toyota: { default: '0W-20 Full Synthetic', Diesel: '5W-30 Diesel' },
  Honda: { default: '0W-20 Full Synthetic', Diesel: '5W-30 Diesel' },
  Ford: { default: '5W-30 Full Synthetic', 'Diesel': '15W-40 Diesel', 'Turbocharged 4-Cylinder': '5W-30 Full Synthetic' },
  Chevrolet: { default: '5W-30 Conventional/Synthetic', Diesel: '15W-40 Diesel' },
  GMC: { default: '5W-30 Conventional/Synthetic', Diesel: '15W-40 Diesel' },
  Dodge: { default: '5W-20 Conventional/Synthetic', Diesel: '15W-40 Diesel' },
  Ram: { default: '5W-20 Full Synthetic', Diesel: '15W-40 Diesel' },
  Jeep: { default: '5W-20 Conventional/Synthetic' },
  Nissan: { default: '5W-30 Full Synthetic' },
  Hyundai: { default: '5W-30 Full Synthetic' },
  Kia: { default: '5W-30 Full Synthetic' },
  Subaru: { default: '0W-20 Full Synthetic' },
  BMW: { default: '5W-30 Full Synthetic (BMW LL-01)', 'Diesel': '5W-30 Diesel Full Synthetic' },
  'Mercedes-Benz': { default: '5W-40 Full Synthetic (MB 229.5)' },
  Audi: { default: '5W-40 Full Synthetic (VW 502.00)' },
  Volkswagen: { default: '5W-40 Full Synthetic (VW 502.00)' },
  Lexus: { default: '0W-20 Full Synthetic' },
  Acura: { default: '0W-20 Full Synthetic' },
  default: { default: '5W-30 Conventional (verify owner\'s manual)' },
}

export function getOilSpec(make, engineType) {
  const makeSpecs = OIL_SPECS[make] || OIL_SPECS.default
  return makeSpecs[engineType] || makeSpecs.default || OIL_SPECS.default.default
}
