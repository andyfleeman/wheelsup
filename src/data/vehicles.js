// Curated static vehicle list — common US makes and models
// Sorted alphabetically by make, then by model popularity

export const VEHICLE_DATA = {
  'Acura': [
    'ILX', 'Integra', 'MDX', 'RDX', 'RLX', 'TL', 'TLX', 'TSX', 'ZDX',
  ],
  'Audi': [
    'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'e-tron', 'Q3', 'Q5', 'Q7', 'Q8',
    'R8', 'RS3', 'RS5', 'RS7', 'S3', 'S4', 'S5', 'S6', 'S7', 'SQ5', 'TT',
  ],
  'BMW': [
    '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series',
    '8 Series', 'i3', 'i4', 'i5', 'i7', 'iX', 'M2', 'M3', 'M4', 'M5',
    'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4',
  ],
  'Buick': [
    'Enclave', 'Encore', 'Encore GX', 'Envision', 'LaCrosse',
    'Lucerne', 'Regal', 'Verano',
  ],
  'Cadillac': [
    'ATS', 'CT4', 'CT5', 'CTS', 'Escalade', 'Escalade ESV', 'LYRIQ',
    'SRX', 'STS', 'XT4', 'XT5', 'XT6', 'XTS',
  ],
  'Chevrolet': [
    'Blazer', 'Bolt EUV', 'Bolt EV', 'Camaro', 'Colorado',
    'Corvette', 'Cruze', 'Equinox', 'Express 1500', 'Express 2500',
    'Express 3500', 'Impala', 'Malibu', 'Silverado 1500',
    'Silverado 2500HD', 'Silverado 3500HD', 'Sonic', 'Spark',
    'Suburban', 'Tahoe', 'Trailblazer', 'Traverse', 'Trax',
  ],
  'Chrysler': [
    '200', '300', 'Pacifica', 'Town & Country', 'Voyager',
  ],
  'Dodge': [
    'Challenger', 'Charger', 'Dart', 'Durango', 'Grand Caravan',
    'Hornet', 'Journey',
  ],
  'Ford': [
    'Bronco', 'Bronco Sport', 'E-Transit', 'EcoSport', 'Edge',
    'Escape', 'Expedition', 'Explorer', 'F-150', 'F-150 Lightning',
    'F-250 Super Duty', 'F-350 Super Duty', 'F-450 Super Duty',
    'Flex', 'Focus', 'Fusion', 'Maverick', 'Mustang', 'Mustang Mach-E',
    'Ranger', 'Taurus', 'Transit', 'Transit Connect',
  ],
  'GMC': [
    'Acadia', 'Canyon', 'Envoy', 'Envoy XL', 'Hummer EV',
    'Safari', 'Sierra 1500', 'Sierra 2500HD', 'Sierra 3500HD',
    'Terrain', 'Yukon', 'Yukon XL',
  ],
  'Honda': [
    'Accord', 'Civic', 'CR-V', 'CR-Z', 'Element', 'Fit',
    'HR-V', 'Insight', 'Odyssey', 'Passport', 'Pilot',
    'Prologue', 'Ridgeline',
  ],
  'Hyundai': [
    'Accent', 'Elantra', 'IONIQ', 'IONIQ 5', 'IONIQ 6', 'Kona',
    'Palisade', 'Santa Cruz', 'Santa Fe', 'Sonata', 'Tucson',
    'Veloster', 'Venue',
  ],
  'Infiniti': [
    'Q50', 'Q60', 'QX50', 'QX55', 'QX60', 'QX80',
  ],
  'Jeep': [
    'Cherokee', 'Compass', 'Gladiator', 'Grand Cherokee',
    'Grand Cherokee L', 'Grand Wagoneer', 'Renegade', 'Wagoneer',
    'Wrangler', 'Wrangler Unlimited',
  ],
  'Kia': [
    'Carnival', 'EV6', 'EV9', 'Forte', 'K5', 'Niro',
    'Seltos', 'Soul', 'Sorento', 'Sportage', 'Stinger', 'Telluride',
  ],
  'Lexus': [
    'ES', 'GS', 'GX', 'IS', 'LC', 'LX', 'NX', 'RC',
    'RX', 'RZ', 'TX', 'UX',
  ],
  'Lincoln': [
    'Aviator', 'Continental', 'Corsair', 'MKC', 'MKT',
    'MKX', 'MKZ', 'Navigator', 'Nautilus',
  ],
  'Mazda': [
    'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-70', 'CX-9', 'CX-90',
    'Mazda3', 'Mazda6', 'MX-5 Miata', 'MX-30',
  ],
  'Mercedes-Benz': [
    'A-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'EQB', 'EQS',
    'G-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'S-Class',
    'SL', 'Sprinter',
  ],
  'Mitsubishi': [
    'Eclipse Cross', 'Galant', 'Lancer', 'Mirage', 'Outlander',
    'Outlander Sport', 'Outlander PHEV',
  ],
  'Nissan': [
    'Altima', 'Armada', 'Frontier', 'Kicks', 'Leaf', 'Maxima',
    'Murano', 'Pathfinder', 'Rogue', 'Rogue Sport', 'Sentra',
    'Titan', 'Titan XD', 'Versa',
  ],
  'Oldsmobile': [
    'Alero', 'Aurora', 'Bravada', 'Cutlass', 'Intrigue',
    'Silhouette', 'Ninety-Eight',
  ],
  'Pontiac': [
    'Aztek', 'Bonneville', 'G5', 'G6', 'G8', 'Grand Am',
    'Grand Prix', 'Montana', 'Solstice', 'Torrent', 'Vibe',
  ],
  'Ram': [
    '1500', '1500 Classic', '2500', '3500', 'ProMaster',
    'ProMaster City',
  ],
  'Saturn': [
    'Aura', 'Ion', 'Outlook', 'Sky', 'Vue',
  ],
  'Subaru': [
    'Ascent', 'BRZ', 'Crosstrek', 'Forester', 'Impreza',
    'Legacy', 'Outback', 'Solterra', 'WRX',
  ],
  'Tesla': [
    'Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y',
  ],
  'Toyota': [
    '4Runner', 'Avalon', 'bZ4X', 'Camry', 'Corolla',
    'Corolla Cross', 'Crown', 'GR86', 'Highlander', 'Land Cruiser',
    'Prius', 'Prius Prime', 'RAV4', 'RAV4 Prime', 'Sequoia',
    'Sienna', 'Supra', 'Tacoma', 'Tundra', 'Venza',
  ],
  'Volkswagen': [
    'Atlas', 'Atlas Cross Sport', 'Golf', 'GTI', 'ID.4',
    'Jetta', 'Passat', 'Taos', 'Tiguan',
  ],
  'Volvo': [
    'C40 Recharge', 'EX30', 'EX90', 'S60', 'S90',
    'V60', 'V90', 'XC40', 'XC60', 'XC90',
  ],
}

export const MAKES = Object.keys(VEHICLE_DATA).sort()

export function getModels(make) {
  return VEHICLE_DATA[make] || []
}

export function getYears() {
  const current = new Date().getFullYear() + 1
  const years = []
  for (let y = current; y >= 1990; y--) years.push(y)
  return years
}
