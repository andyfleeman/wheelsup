// Oil spec database: [yearFrom, yearTo, oilWeight, capacityQt]
// Covers the most common US vehicles 2010–present
// Source: OEM owner's manuals / dealer specs

const DB = {
  Acura: {
    ILX:     [[2016, 9999, '0W-20', 4.2], [2013, 2015, '0W-20', 4.2]],
    MDX:     [[2022, 9999, '0W-20', 4.5], [2016, 2021, '0W-20', 5.3], [2010, 2015, '5W-20', 4.5]],
    RDX:     [[2019, 9999, '0W-20', 4.5], [2013, 2018, '5W-20', 4.5]],
    TLX:     [[2021, 9999, '0W-20', 4.2], [2015, 2020, '0W-20', 4.5]],
  },
  Audi: {
    A3:      [[2015, 9999, '5W-40', 4.5]],
    'e-tron': [[2019, 9999, null, null]], // BEV
    A4:      [[2017, 9999, '5W-40', 4.5], [2012, 2016, '5W-40', 5.3]],
    A6:      [[2019, 9999, '5W-30', 6.3], [2012, 2018, '5W-40', 5.8]],
    Q3:      [[2015, 9999, '5W-40', 4.5]],
    Q5:      [[2018, 9999, '5W-40', 5.5], [2013, 2017, '5W-40', 5.3]],
    Q7:      [[2017, 9999, '5W-40', 5.5], [2007, 2016, '5W-40', 7.4]],
    Q8:      [[2019, 9999, '5W-40', 7.4]],
    TT:      [[2016, 9999, '5W-40', 4.5]],
  },
  BMW: {
    '2 Series': [[2014, 9999, '0W-30', 5.3]],
    '3 Series': [[2019, 9999, '0W-30', 5.3], [2012, 2018, '5W-30', 4.9]],
    '4 Series': [[2014, 9999, '0W-30', 5.3]],
    '5 Series': [[2017, 9999, '0W-30', 6.3], [2011, 2016, '5W-30', 6.3]],
    '7 Series': [[2016, 9999, '0W-30', 7.4]],
    i3:         [[2014, 2021, null, null]], // BEV
    i4:         [[2022, 9999, null, null]], // BEV
    i5:         [[2024, 9999, null, null]], // BEV
    i7:         [[2023, 9999, null, null]], // BEV
    iX:         [[2022, 9999, null, null]], // BEV
    M2:         [[2023, 9999, '10W-60', 6.3], [2016, 2022, '10W-60', 5.8]],
    M3:         [[2021, 9999, '10W-60', 6.3], [2015, 2020, '10W-60', 5.8]],
    M4:         [[2021, 9999, '10W-60', 6.3], [2015, 2020, '10W-60', 5.8]],
    M5:         [[2018, 9999, '10W-60', 7.4]],
    X1:         [[2016, 9999, '0W-30', 5.3]],
    X3:         [[2018, 9999, '0W-30', 5.5], [2011, 2017, '5W-30', 5.3]],
    X4:         [[2015, 9999, '0W-30', 5.5]],
    X5:         [[2019, 9999, '0W-30', 7.4], [2014, 2018, '5W-30', 6.3]],
    X6:         [[2019, 9999, '0W-30', 7.4], [2015, 2018, '5W-30', 6.3]],
    X7:         [[2019, 9999, '0W-30', 7.4]],
  },
  Buick: {
    Enclave:    [[2018, 9999, '5W-30', 5.0], [2008, 2017, '5W-30', 6.0]],
    Encore:     [[2013, 9999, '5W-30', 4.0]],
    'Encore GX':[[2020, 9999, '0W-20', 4.2]],
    Envision:   [[2016, 9999, '5W-30', 5.0]],
    LaCrosse:   [[2017, 9999, '5W-30', 5.0], [2010, 2016, '5W-30', 6.0]],
  },
  Cadillac: {
    ATS:        [[2013, 2019, '5W-30', 5.0]],
    CT4:        [[2020, 9999, '5W-30', 5.0]],
    LYRIQ:      [[2023, 9999, null, null]], // BEV
    CT5:        [[2020, 9999, '5W-30', 5.0]],
    CTS:        [[2014, 9999, '5W-30', 5.0]],
    Escalade:   [[2021, 9999, '0W-20', 8.0], [2015, 2020, '5W-30', 8.0]],
    'Escalade ESV': [[2021, 9999, '0W-20', 8.0], [2015, 2020, '5W-30', 8.0]],
    SRX:        [[2010, 2016, '5W-30', 6.0]],
    XT4:        [[2019, 9999, '0W-20', 5.0]],
    XT5:        [[2017, 9999, '5W-30', 5.0]],
    XT6:        [[2020, 9999, '5W-30', 5.0]],
    XTS:        [[2013, 2019, '5W-30', 5.0]],
  },
  Chevrolet: {
    Blazer:       [[2019, 9999, '5W-30', 5.0]],
    'Bolt EV':    [[2017, 9999, null, null]], // BEV
    'Bolt EUV':   [[2022, 9999, null, null]], // BEV
    Camaro:       [[2016, 9999, '5W-30', 5.9]], // V6; V8 is 8.0 qt
    Colorado:     [[2015, 9999, '5W-30', 5.0]],
    Corvette:     [[2020, 9999, '5W-50', 9.5], [2014, 2019, '5W-30', 8.0]],
    Cruze:        [[2011, 2019, '5W-30', 4.2]],
    Equinox:      [[2018, 9999, '0W-20', 4.2], [2010, 2017, '5W-30', 5.0]],
    Impala:       [[2014, 2020, '5W-30', 5.0]],
    Malibu:       [[2016, 9999, '0W-20', 4.2], [2013, 2015, '5W-30', 5.0]],
    'Silverado 1500': [[2019, 9999, '0W-20', 8.0], [2014, 2018, '0W-20', 8.0], [2010, 2013, '5W-30', 6.0]],
    'Silverado 2500HD': [[2020, 9999, '0W-20', 6.0]], // gas; diesel is different
    'Silverado 3500HD': [[2020, 9999, '0W-20', 6.0]],
    Sonic:        [[2012, 2020, '5W-30', 4.0]],
    Spark:        [[2013, 9999, '5W-30', 3.5]],
    Suburban:     [[2021, 9999, '0W-20', 8.0], [2015, 2020, '5W-30', 8.0]],
    Tahoe:        [[2021, 9999, '0W-20', 8.0], [2015, 2020, '5W-30', 8.0]],
    Trailblazer:  [[2021, 9999, '0W-20', 4.0]],
    Traverse:     [[2018, 9999, '5W-30', 5.0], [2009, 2017, '5W-30', 6.0]],
    Trax:         [[2024, 9999, '5W-30', 5.0], [2013, 2022, '5W-30', 4.0]],
  },
  Chrysler: {
    '300':          [[2011, 9999, '5W-20', 5.9]],
    Pacifica:       [[2017, 9999, '5W-20', 5.9]],
    'Town & Country': [[2008, 2016, '5W-20', 5.9]],
    Voyager:        [[2020, 9999, '5W-20', 5.9]],
  },
  Dodge: {
    Challenger:  [[2015, 9999, '5W-20', 5.9]], // V6; V8 HEMI is 7.0 qt
    Charger:     [[2015, 9999, '5W-20', 5.9]], // V6; V8 HEMI is 7.0 qt
    Dart:        [[2013, 2016, '5W-40', 4.5]],
    Durango:     [[2011, 9999, '5W-20', 5.9]],
    'Grand Caravan': [[2008, 2020, '5W-20', 5.9]],
    Hornet:      [[2023, 9999, '5W-30', 5.0]],
    Journey:     [[2009, 2020, '5W-20', 5.0]],
  },
  Ford: {
    Bronco:       [[2021, 9999, '5W-30', 5.7]],
    'E-Transit':  [[2022, 9999, null, null]], // BEV
    'Bronco Sport': [[2021, 9999, '5W-30', 4.3]],
    EcoSport:     [[2018, 2022, '5W-20', 4.3]],
    Edge:         [[2019, 9999, '5W-30', 5.7], [2015, 2018, '5W-30', 6.0]],
    Escape:       [[2020, 9999, '5W-30', 4.3], [2013, 2019, '5W-30', 5.0]],
    Expedition:   [[2018, 9999, '5W-30', 6.0], [2015, 2017, '5W-30', 6.0]],
    Explorer:     [[2020, 9999, '5W-30', 5.7], [2016, 2019, '5W-30', 6.0], [2011, 2015, '5W-20', 6.0]],
    'F-150':      [[2021, 9999, '5W-30', 6.0], [2015, 2020, '5W-30', 6.0], [2011, 2014, '5W-20', 6.0]],
    'F-150 Lightning': [[2022, 9999, null, null]], // EV — no oil change
    'F-250 Super Duty': [[2020, 9999, '5W-30', 6.0], [2011, 2019, '5W-20', 7.0]],
    'F-350 Super Duty': [[2020, 9999, '5W-30', 6.0], [2011, 2019, '5W-20', 7.0]],
    Flex:         [[2010, 2019, '5W-20', 6.0]],
    Focus:        [[2012, 2018, '5W-20', 4.5]],
    Fusion:       [[2013, 2020, '5W-30', 5.7]],
    Maverick:     [[2022, 9999, '5W-30', 5.0]],
    Mustang:      [[2018, 9999, '5W-50', 8.0], [2015, 2017, '5W-50', 8.0]], // V8; EcoBoost: 5W-30 5.7 qt
    'Mustang Mach-E': [[2021, 9999, null, null]], // EV
    Ranger:       [[2019, 9999, '5W-30', 5.7]],
    Taurus:       [[2010, 2019, '5W-20', 6.0]],
    Transit:      [[2015, 9999, '5W-30', 6.0]],
  },
  GMC: {
    Acadia:    [[2017, 9999, '5W-30', 5.0], [2007, 2016, '5W-30', 6.0]],
    Canyon:    [[2015, 9999, '5W-30', 5.0]],
    'Sierra 1500':    [[2019, 9999, '0W-20', 8.0], [2014, 2018, '0W-20', 8.0], [2010, 2013, '5W-30', 6.0]],
    'Sierra 2500HD':  [[2020, 9999, '0W-20', 6.0]],
    'Sierra 3500HD':  [[2020, 9999, '0W-20', 6.0]],
    Terrain:   [[2018, 9999, '0W-20', 4.2], [2010, 2017, '5W-30', 5.0]],
    Yukon:     [[2021, 9999, '0W-20', 8.0], [2015, 2020, '5W-30', 8.0]],
    'Yukon XL':[[2021, 9999, '0W-20', 8.0], [2015, 2020, '5W-30', 8.0]],
  },
  Honda: {
    Accord:    [[2018, 9999, '0W-20', 3.7], [2013, 2017, '0W-20', 4.2], [2008, 2012, '5W-20', 4.4]],
    Civic:     [[2016, 9999, '0W-20', 3.7], [2012, 2015, '0W-20', 3.9]],
    'CR-V':    [[2017, 9999, '0W-20', 3.5], [2012, 2016, '0W-20', 4.4]],
    'CR-Z':    [[2011, 2016, '0W-20', 3.4]],
    Element:   [[2003, 2011, '5W-20', 4.2]],
    Fit:       [[2015, 9999, '0W-20', 3.4], [2009, 2014, '5W-20', 3.4]],
    'HR-V':    [[2023, 9999, '0W-20', 3.4], [2016, 2022, '0W-20', 3.9]],
    Insight:   [[2019, 9999, '0W-20', 3.4]],
    Odyssey:   [[2018, 9999, '0W-20', 4.5], [2011, 2017, '5W-20', 4.5]],
    Passport:  [[2019, 9999, '0W-20', 5.7]],
    Pilot:     [[2016, 9999, '0W-20', 5.7], [2009, 2015, '5W-20', 4.5]],
    Ridgeline: [[2017, 9999, '0W-20', 5.0]],
  },
  Hyundai: {
    Accent:     [[2017, 9999, '5W-30', 3.5]],
    Elantra:    [[2021, 9999, '5W-30', 3.7], [2017, 2020, '5W-20', 3.7], [2011, 2016, '5W-20', 3.7]],
    IONIQ:      [[2017, 2022, '0W-20', 3.7]], // hybrid
    'IONIQ 5':  [[2022, 9999, null, null]], // BEV
    'IONIQ 6':  [[2023, 9999, null, null]], // BEV
    Kona:       [[2018, 9999, '5W-20', 3.9]],
    Palisade:   [[2020, 9999, '5W-30', 6.6]],
    'Santa Cruz': [[2022, 9999, '5W-30', 5.3]],
    'Santa Fe': [[2019, 9999, '5W-30', 5.3], [2013, 2018, '5W-20', 5.3]],
    Sonata:     [[2020, 9999, '5W-30', 5.3], [2015, 2019, '5W-20', 4.8], [2011, 2014, '5W-20', 4.8]],
    Tucson:     [[2022, 9999, '5W-30', 5.3], [2016, 2021, '5W-20', 4.2]],
    Veloster:   [[2019, 9999, '5W-30', 4.2], [2012, 2018, '5W-20', 3.7]],
    Venue:      [[2020, 9999, '5W-20', 3.5]],
  },
  Infiniti: {
    Q50:   [[2014, 9999, '5W-30', 5.8]],
    Q60:   [[2017, 9999, '5W-30', 5.8]],
    QX50:  [[2019, 9999, '0W-20', 4.5], [2014, 2018, '5W-30', 5.8]],
    QX60:  [[2022, 9999, '5W-30', 5.4], [2013, 2021, '5W-30', 5.4]],
    QX80:  [[2014, 9999, '5W-30', 6.5]],
  },
  Jeep: {
    Cherokee:       [[2019, 9999, '0W-20', 5.0], [2014, 2018, '5W-20', 5.0]],
    Compass:        [[2017, 9999, '0W-20', 5.0]],
    Gladiator:      [[2020, 9999, '5W-20', 6.0]],
    'Grand Cherokee': [[2021, 9999, '0W-20', 5.9], [2011, 2020, '5W-20', 5.9]],
    'Grand Cherokee L': [[2021, 9999, '0W-20', 5.9]],
    Renegade:       [[2015, 9999, '5W-40', 4.0]],
    Wagoneer:       [[2022, 9999, '0W-20', 8.0]],
    'Grand Wagoneer':   [[2022, 9999, '0W-20', 8.0]],
    Wrangler:       [[2018, 9999, '5W-20', 6.0], [2012, 2017, '5W-20', 6.0]],
    'Wrangler Unlimited': [[2018, 9999, '5W-20', 6.0], [2012, 2017, '5W-20', 6.0]],
  },
  Kia: {
    Carnival:  [[2022, 9999, '5W-30', 5.0]],
    EV6:       [[2022, 9999, null, null]], // EV
    EV9:       [[2024, 9999, null, null]], // EV
    Forte:     [[2019, 9999, '5W-20', 3.7]],
    K5:        [[2021, 9999, '5W-30', 4.2]],
    Niro:      [[2017, 9999, '0W-20', 3.7]],
    Seltos:    [[2021, 9999, '5W-30', 4.2]],
    Soul:      [[2014, 9999, '5W-20', 3.7]],
    Sorento:   [[2021, 9999, '5W-30', 5.3], [2016, 2020, '5W-20', 4.2]],
    Sportage:  [[2023, 9999, '5W-30', 5.3], [2017, 2022, '5W-20', 4.2]],
    Stinger:   [[2018, 9999, '5W-30', 5.8]],
    Telluride: [[2020, 9999, '5W-30', 6.6]],
  },
  Lexus: {
    ES:   [[2019, 9999, '0W-16', 3.7], [2013, 2018, '0W-20', 5.0]],
    GS:   [[2013, 2020, '5W-30', 6.4]],
    GX:   [[2010, 9999, '5W-30', 6.8]],
    IS:   [[2014, 9999, '0W-20', 5.3]],
    LC:   [[2018, 9999, '0W-20', 7.4]],
    LX:   [[2022, 9999, '0W-20', 6.6], [2008, 2021, '5W-30', 7.0]],
    NX:   [[2022, 9999, '0W-16', 3.7], [2015, 2021, '0W-20', 5.3]],
    RC:   [[2015, 9999, '0W-20', 5.3]],
    RX:   [[2016, 9999, '0W-20', 6.4], [2010, 2015, '5W-30', 6.4]],
    RZ:   [[2023, 9999, null, null]], // EV
    TX:   [[2024, 9999, '0W-16', 3.7]],
    UX:   [[2019, 9999, '0W-16', 3.7]],
  },
  Lincoln: {
    Aviator:    [[2020, 9999, '5W-30', 5.7]],
    Continental: [[2017, 2020, '5W-30', 5.7]],
    Corsair:    [[2020, 9999, '5W-30', 4.3]],
    MKX:        [[2016, 2018, '5W-30', 5.7]],
    MKZ:        [[2013, 2020, '5W-30', 5.7]],
    Nautilus:   [[2019, 9999, '5W-30', 5.7]],
    Navigator:  [[2018, 9999, '5W-30', 6.0]],
  },
  Mazda: {
    'CX-30':   [[2020, 9999, '0W-20', 4.5]],
    'CX-3':    [[2016, 2021, '0W-20', 4.5]],
    'CX-5':    [[2017, 9999, '0W-20', 4.5]], // 2.5T uses 5W-30 5.3 qt
    'CX-50':   [[2023, 9999, '0W-20', 4.5]],
    'CX-9':    [[2016, 9999, '5W-30', 5.3]],
    'CX-90':   [[2024, 9999, '5W-30', 5.8]],
    Mazda3:    [[2019, 9999, '0W-20', 4.5], [2014, 2018, '0W-20', 4.5]],
    Mazda6:    [[2014, 2021, '0W-20', 4.5]],
    'MX-5 Miata': [[2016, 9999, '5W-30', 4.2]],
  },
  'Mercedes-Benz': {
    'A-Class':  [[2019, 9999, '5W-40', 5.5]],
    'C-Class':  [[2015, 9999, '5W-40', 6.3], [2008, 2014, '5W-40', 6.3]],
    CLA:        [[2014, 9999, '5W-40', 5.5]],
    CLS:        [[2012, 9999, '5W-40', 6.3]],
    'E-Class':  [[2017, 9999, '5W-40', 6.3], [2010, 2016, '5W-40', 6.3]],
    'G-Class':  [[2019, 9999, '5W-40', 8.5]],
    GLA:        [[2015, 9999, '5W-40', 5.5]],
    GLB:        [[2020, 9999, '5W-40', 5.5]],
    GLC:        [[2016, 9999, '5W-40', 6.3]],
    GLE:        [[2020, 9999, '5W-40', 8.5], [2016, 2019, '5W-40', 6.3]],
    GLS:        [[2020, 9999, '5W-40', 8.5]],
    'S-Class':  [[2021, 9999, '5W-40', 8.5], [2014, 2020, '5W-40', 8.5]],
    Sprinter:   [[2019, 9999, '5W-30', 8.0]],
  },
  Mitsubishi: {
    'Eclipse Cross': [[2018, 9999, '0W-20', 4.0]],
    Lancer:     [[2008, 2017, '5W-30', 4.0]],
    Mirage:     [[2014, 9999, '0W-20', 3.2]],
    Outlander:  [[2014, 9999, '5W-30', 4.5]],
    'Outlander Sport': [[2011, 9999, '5W-30', 4.0]],
  },
  Nissan: {
    Altima:    [[2019, 9999, '0W-20', 4.6], [2013, 2018, '5W-30', 4.9]],
    Leaf:      [[2011, 9999, null, null]], // BEV
    Armada:    [[2017, 9999, '5W-30', 6.5], [2004, 2016, '5W-30', 6.5]],
    Frontier:  [[2022, 9999, '5W-30', 5.1], [2005, 2021, '5W-30', 5.1]],
    Kicks:     [[2018, 9999, '0W-20', 3.4]],
    Maxima:    [[2016, 9999, '5W-30', 5.1]],
    Murano:    [[2015, 9999, '5W-30', 5.1]],
    Pathfinder: [[2022, 9999, '5W-30', 5.1], [2013, 2021, '5W-30', 5.1]],
    Rogue:     [[2021, 9999, '0W-20', 4.5], [2014, 2020, '0W-20', 5.0]],
    'Rogue Sport': [[2017, 9999, '0W-20', 4.4]],
    Sentra:    [[2020, 9999, '0W-20', 4.1], [2013, 2019, '5W-30', 4.1]],
    Titan:     [[2016, 9999, '5W-30', 7.1]],
    'Titan XD':[[2016, 9999, '5W-30', 7.1]],
    Versa:     [[2020, 9999, '0W-20', 3.5], [2012, 2019, '5W-30', 3.7]],
  },
  Ram: {
    '1500':    [[2019, 9999, '0W-20', 7.0], [2009, 2018, '5W-20', 7.0]],
    '2500':    [[2014, 9999, '5W-20', 7.0]],
    '3500':    [[2014, 9999, '5W-20', 7.0]],
  },
  Subaru: {
    Ascent:    [[2019, 9999, '0W-20', 5.4]],
    BRZ:       [[2017, 9999, '5W-30', 5.3]],
    Crosstrek: [[2018, 9999, '0W-20', 5.1], [2013, 2017, '5W-30', 4.4]],
    Forester:  [[2019, 9999, '0W-20', 5.1], [2014, 2018, '5W-30', 4.4]],
    Impreza:   [[2017, 9999, '0W-20', 5.1], [2012, 2016, '5W-30', 4.4]],
    Legacy:    [[2020, 9999, '0W-20', 5.1], [2015, 2019, '0W-20', 5.1], [2010, 2014, '5W-30', 4.4]],
    Outback:   [[2020, 9999, '0W-20', 5.1], [2015, 2019, '0W-20', 5.1], [2010, 2014, '5W-30', 4.4]],
    WRX:       [[2022, 9999, '5W-30', 5.4], [2015, 2021, '5W-30', 5.4]],
  },
  Toyota: {
    '4Runner':  [[2010, 9999, '5W-30', 5.5]],
    Avalon:     [[2019, 9999, '0W-16', 3.9], [2013, 2018, '0W-20', 6.4]],
    Camry:      [[2018, 9999, '0W-20', 4.8], [2012, 2017, '0W-20', 4.5], [2007, 2011, '5W-30', 6.4]],
    Corolla:    [[2019, 9999, '0W-20', 4.4], [2014, 2018, '0W-20', 4.4], [2009, 2013, '5W-30', 4.4]],
    'GR86':     [[2022, 9999, '5W-30', 5.3]],
    Highlander: [[2020, 9999, '0W-20', 6.4], [2014, 2019, '0W-20', 6.4], [2008, 2013, '5W-30', 5.5]],
    Mirai:      [[2021, 9999, null, null]], // Hydrogen fuel cell
    Prius:      [[2023, 9999, '0W-16', 4.2], [2016, 2022, '0W-20', 3.9], [2010, 2015, '0W-20', 3.7]],
    RAV4:       [[2019, 9999, '0W-20', 4.8], [2013, 2018, '0W-20', 4.4]],
    Sequoia:    [[2022, 9999, '0W-35', 7.5], [2008, 2021, '5W-30', 7.4]],
    Sienna:     [[2021, 9999, '0W-16', 4.6], [2011, 2020, '0W-20', 6.4]],
    Supra:      [[2020, 9999, '0W-30', 5.3]],
    Tacoma:     [[2016, 9999, '0W-20', 6.1], [2012, 2015, '5W-30', 5.5]],
    Tundra:     [[2022, 9999, '0W-35', 7.3], [2007, 2021, '5W-30', 7.4]],
    Venza:      [[2021, 9999, '0W-16', 4.4]],
  },
  Volkswagen: {
    Atlas:          [[2018, 9999, '5W-40', 6.5]],
    'Atlas Cross Sport': [[2020, 9999, '5W-40', 5.5]],
    'Golf GTI':     [[2015, 9999, '5W-40', 4.5]],
    'ID.4':         [[2021, 9999, null, null]], // BEV
    Jetta:          [[2019, 9999, '5W-40', 4.5], [2011, 2018, '5W-40', 4.5]],
    Taos:           [[2022, 9999, '5W-40', 4.5]],
    Tiguan:         [[2018, 9999, '5W-40', 5.5], [2009, 2017, '5W-40', 4.5]],
    Touareg:        [[2018, 9999, '5W-40', 7.4]],
  },
  Tesla: {
    Cybertruck: [[2024, 9999, null, null]], // BEV
    'Model 3':  [[2017, 9999, null, null]], // BEV
    'Model S':  [[2012, 9999, null, null]], // BEV
    'Model X':  [[2015, 9999, null, null]], // BEV
    'Model Y':  [[2020, 9999, null, null]], // BEV
  },
}

// Oil filter part numbers keyed by "Make Model"
// Sources: Wix, Fram, Motorcraft fitment data; forum/parts-retailer cross-references
// Always verify against your specific VIN/engine at a parts store before buying
const FILTER_DB = {
  'Toyota 4Runner':          { wix: '57047',   fram: 'PH4967'   },
  'Toyota Avalon':           { wix: '57047',   fram: 'CH25723'  },
  'Toyota Camry':            { wix: '57047',   fram: 'CH25723'  },
  'Toyota Corolla':          { wix: '51348',   fram: 'PH4967'   },
  'Toyota GR86':             { wix: '57055',   fram: 'PH9688'   },
  'Toyota Highlander':       { wix: '57047',   fram: 'CH9972'   },
  'Toyota Prius':            { wix: '51348',   fram: 'PH4967'   },
  'Toyota RAV4':             { wix: '57047',   fram: 'CH25723'  },
  'Toyota Sequoia':          { wix: '57310',   fram: 'CH10295'  },
  'Toyota Sienna':           { wix: '57047',   fram: 'CH9972'   },
  'Toyota Supra':            { wix: 'WL10358'                   },
  'Toyota Tacoma':           { wix: '59924TR', fram: 'CH9972'   },
  'Toyota Tundra':           { wix: '57310',   fram: 'CH10295'  },
  'Toyota Venza':            { wix: '51348',   fram: 'PH4967'   },
  'Honda Accord':            { wix: '57356',   fram: 'PH7317'   },
  'Honda Civic':             { wix: '57356',   fram: 'PH7317'   },
  'Honda CR-V':              { wix: '57356',   fram: 'PH7317'   },
  'Honda Fit':               { wix: '57356',   fram: 'PH7317'   },
  'Honda HR-V':              { wix: '57356',   fram: 'PH7317'   },
  'Honda Insight':           { wix: '57356',   fram: 'PH7317'   },
  'Honda Odyssey':           { wix: '57356',   fram: 'PH6607'   },
  'Honda Passport':          { wix: '57356',   fram: 'PH6607'   },
  'Honda Pilot':             { wix: '57356',   fram: 'PH6607'   },
  'Honda Ridgeline':         { wix: '57356',   fram: 'PH6607'   },
  'Ford Bronco':             { wix: '51348',   fram: 'PH3614',  motorcraft: 'FL-910-S' },
  'Ford Bronco Sport':       { wix: '51348',   fram: 'PH3614',  motorcraft: 'FL-910-S' },
  'Ford EcoSport':           { wix: '51348',   fram: 'PH3614',  motorcraft: 'FL-910-S' },
  'Ford Edge':               { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford Escape':             { wix: '51348',   fram: 'PH3614',  motorcraft: 'FL-910-S' },
  'Ford Expedition':         { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford Explorer':           { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford F-150':              { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford F-250 Super Duty':   { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford F-350 Super Duty':   { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford Fusion':             { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford Maverick':           { wix: '51348',   fram: 'PH3614',  motorcraft: 'FL-910-S' },
  'Ford Mustang':            { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford Ranger':             { wix: '51348',   fram: 'PH3614',  motorcraft: 'FL-910-S' },
  'Ford Taurus':             { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Ford Transit':            { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Chevrolet Blazer':        { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Camaro':        { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Colorado':      { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Equinox':       { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Malibu':        { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Silverado 1500':{ wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Silverado 2500HD':{ wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Silverado 3500HD':{ wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Suburban':      { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Tahoe':         { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Traverse':      { wix: 'WL10255', fram: 'PH12060' },
  'Chevrolet Trax':          { wix: 'WL10255', fram: 'PH12060' },
  'GMC Acadia':              { wix: 'WL10255', fram: 'PH12060' },
  'GMC Canyon':              { wix: 'WL10255', fram: 'PH12060' },
  'GMC Sierra 1500':         { wix: 'WL10255', fram: 'PH12060' },
  'GMC Sierra 2500HD':       { wix: 'WL10255', fram: 'PH12060' },
  'GMC Sierra 3500HD':       { wix: 'WL10255', fram: 'PH12060' },
  'GMC Terrain':             { wix: 'WL10255', fram: 'PH12060' },
  'GMC Yukon':               { wix: 'WL10255', fram: 'PH12060' },
  'GMC Yukon XL':            { wix: 'WL10255', fram: 'PH12060' },
  'Buick Enclave':           { wix: 'WL10255', fram: 'PH12060' },
  'Buick Encore':            { wix: 'WL10255', fram: 'PH12060' },
  'Buick Encore GX':         { wix: 'WL10255', fram: 'PH12060' },
  'Buick Envision':          { wix: 'WL10255', fram: 'PH12060' },
  'Cadillac Escalade':       { wix: 'WL10255', fram: 'PH12060' },
  'Cadillac Escalade ESV':   { wix: 'WL10255', fram: 'PH12060' },
  'Cadillac XT4':            { wix: 'WL10255', fram: 'PH12060' },
  'Cadillac XT5':            { wix: 'WL10255', fram: 'PH12060' },
  'Cadillac XT6':            { wix: 'WL10255', fram: 'PH12060' },
  'Chrysler 300':            { wix: '57899',   fram: 'PH10060' },
  'Chrysler Pacifica':       { wix: '57899',   fram: 'PH10060' },
  'Dodge Challenger':        { wix: '57899',   fram: 'PH10060' },
  'Dodge Charger':           { wix: '57899',   fram: 'PH10060' },
  'Dodge Durango':           { wix: '57899',   fram: 'PH10060' },
  'Ram 1500':                { wix: '57899',   fram: 'PH10060' },
  'Ram 2500':                { wix: '57899',   fram: 'PH10060' },
  'Ram 3500':                { wix: '57899',   fram: 'PH10060' },
  'Jeep Cherokee':           { wix: '57060',   fram: 'PH10060' },
  'Jeep Compass':            { wix: '57060',   fram: 'PH10060' },
  'Jeep Gladiator':          { wix: 'WL10255', fram: 'CH11665' },
  'Jeep Grand Cherokee':     { wix: '57899',   fram: 'PH10060' },
  'Jeep Grand Cherokee L':   { wix: '57899',   fram: 'PH10060' },
  'Jeep Wrangler':           { wix: 'WL10255', fram: 'CH11665' },
  'Jeep Wrangler Unlimited': { wix: 'WL10255', fram: 'CH11665' },
  'Nissan Altima':           { wix: '51358',   fram: 'PH6607'  },
  'Nissan Armada':           { wix: '57356',   fram: 'PH7317'  },
  'Nissan Frontier':         { wix: '57356',   fram: 'PH7317'  },
  'Nissan Kicks':            { wix: '51358',   fram: 'PH6607'  },
  'Nissan Maxima':           { wix: '57356',   fram: 'PH7317'  },
  'Nissan Murano':           { wix: '57356',   fram: 'PH7317'  },
  'Nissan Pathfinder':       { wix: '57356',   fram: 'PH7317'  },
  'Nissan Rogue':            { wix: '51358',   fram: 'PH6607'  },
  'Nissan Rogue Sport':      { wix: '51358',   fram: 'PH6607'  },
  'Nissan Sentra':           { wix: '51358',   fram: 'PH6607'  },
  'Nissan Titan':            { wix: '57356',   fram: 'PH7317'  },
  'Nissan Titan XD':         { wix: '57356',   fram: 'PH7317'  },
  'Nissan Versa':            { wix: '51358',   fram: 'PH6607'  },
  'Hyundai Accent':          { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Elantra':         { wix: '51334',   fram: 'PH5724'  },
  'Hyundai IONIQ':           { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Kona':            { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Palisade':        { wix: '57356',   fram: 'PH7317'  },
  'Hyundai Santa Cruz':      { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Santa Fe':        { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Sonata':          { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Tucson':          { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Veloster':        { wix: '51334',   fram: 'PH5724'  },
  'Hyundai Venue':           { wix: '51334',   fram: 'PH5724'  },
  'Kia Carnival':            { wix: '51334',   fram: 'PH5724'  },
  'Kia Forte':               { wix: '51334',   fram: 'PH5724'  },
  'Kia K5':                  { wix: '51334',   fram: 'PH5724'  },
  'Kia Niro':                { wix: '51334',   fram: 'PH5724'  },
  'Kia Seltos':              { wix: '51334',   fram: 'PH5724'  },
  'Kia Soul':                { wix: '51334',   fram: 'PH5724'  },
  'Kia Sorento':             { wix: '51334',   fram: 'PH5724'  },
  'Kia Sportage':            { wix: '51334',   fram: 'PH5724'  },
  'Kia Stinger':             { wix: '51334',   fram: 'PH5724'  },
  'Kia Telluride':           { wix: '16615RK', fram: 'PH7317'  },
  'Subaru Ascent':           { wix: '57055',   fram: 'PH9688'  },
  'Subaru BRZ':              { wix: '57055',   fram: 'PH9688'  },
  'Subaru Crosstrek':        { wix: '57055',   fram: 'PH9688'  },
  'Subaru Forester':         { wix: '57055',   fram: 'PH9688'  },
  'Subaru Impreza':          { wix: '57055',   fram: 'PH9688'  },
  'Subaru Legacy':           { wix: '57055',   fram: 'PH9688'  },
  'Subaru Outback':          { wix: '57055',   fram: 'PH9688'  },
  'Subaru WRX':              { wix: 'WL10078', fram: 'XG9688'  },
  'BMW 2 Series':            { wix: 'WL10358'                  },
  'BMW 3 Series':            { wix: 'WL10358'                  },
  'BMW 4 Series':            { wix: 'WL10358'                  },
  'BMW 5 Series':            { wix: 'WL10358'                  },
  'BMW 7 Series':            { wix: 'WL10358'                  },
  'BMW M2':                  { wix: 'WL10358'                  },
  'BMW M3':                  { wix: 'WL10358'                  },
  'BMW M4':                  { wix: 'WL10358'                  },
  'BMW M5':                  { wix: 'WL10358'                  },
  'BMW X1':                  { wix: 'WL10358'                  },
  'BMW X3':                  { wix: 'WL10358'                  },
  'BMW X4':                  { wix: 'WL10358'                  },
  'BMW X5':                  { wix: 'WL10358'                  },
  'BMW X6':                  { wix: 'WL10358'                  },
  'BMW X7':                  { wix: 'WL10358'                  },
  'Mercedes-Benz A-Class':   { oem: '2701800109'               },
  'Mercedes-Benz C-Class':   { oem: '2701800109'               },
  'Mercedes-Benz CLA':       { oem: '2701800109'               },
  'Mercedes-Benz CLS':       { oem: '2761800009'               },
  'Mercedes-Benz E-Class':   { oem: '2701800109'               },
  'Mercedes-Benz G-Class':   { oem: '2761800009'               },
  'Mercedes-Benz GLA':       { oem: '2701800109'               },
  'Mercedes-Benz GLB':       { oem: '2701800109'               },
  'Mercedes-Benz GLC':       { oem: '2701800109'               },
  'Mercedes-Benz GLE':       { oem: '2761800009'               },
  'Mercedes-Benz GLS':       { oem: '2761800009'               },
  'Mercedes-Benz S-Class':   { oem: '2761800009'               },
  'Acura ILX':               { wix: '57356',   fram: 'PH7317'  },
  'Acura MDX':               { wix: '57356',   fram: 'PH6607'  },
  'Acura RDX':               { wix: '57356',   fram: 'PH7317'  },
  'Acura TLX':               { wix: '57356',   fram: 'PH7317'  },
  'Audi A3':                 { wix: 'WL10396', fram: 'CH11784' },
  'Audi A4':                 { wix: 'WL10396', fram: 'CH11784' },
  'Audi A6':                 { wix: 'WL10396', fram: 'CH11784' },
  'Audi Q3':                 { wix: 'WL10396', fram: 'CH11784' },
  'Audi Q5':                 { wix: 'WL10396', fram: 'CH11784' },
  'Audi Q7':                 { wix: 'WL10396', fram: 'CH11784' },
  'Audi Q8':                 { wix: 'WL10396', fram: 'CH11784' },
  'Audi TT':                 { wix: 'WL10396', fram: 'CH11784' },
  'Volkswagen Atlas':        { wix: 'WL10024', fram: 'CH11784' },
  'Volkswagen Atlas Cross Sport': { wix: 'WL10024', fram: 'CH11784' },
  'Volkswagen Golf GTI':     { wix: 'WL10024', fram: 'CH11784' },
  'Volkswagen Jetta':        { wix: 'WL10024', fram: 'CH11784' },
  'Volkswagen Taos':         { wix: 'WL10024', fram: 'CH11784' },
  'Volkswagen Tiguan':       { wix: 'WL10024', fram: 'CH11784' },
  'Volkswagen Touareg':      { wix: 'WL10396', fram: 'CH11784' },
  'Mazda CX-30':             { wix: '57002'                    },
  'Mazda CX-3':              { wix: '57002'                    },
  'Mazda CX-5':              { wix: '57002'                    },
  'Mazda CX-50':             { wix: '57002'                    },
  'Mazda CX-9':              { wix: '57002'                    },
  'Mazda Mazda3':            { wix: '57002'                    },
  'Mazda Mazda6':            { wix: '57002'                    },
  'Mazda MX-5 Miata':        { wix: '57002'                    },
  'Infiniti Q50':            { wix: '57356',   fram: 'PH7317'  },
  'Infiniti Q60':            { wix: '57356',   fram: 'PH7317'  },
  'Infiniti QX50':           { wix: '57356',   fram: 'PH7317'  },
  'Infiniti QX60':           { wix: '57356',   fram: 'PH7317'  },
  'Infiniti QX80':           { wix: '57356',   fram: 'PH7317'  },
  'Lexus ES':                { wix: '51348',   fram: 'PH4967'  },
  'Lexus GS':                { wix: '57047',   fram: 'CH9972'  },
  'Lexus GX':                { wix: '57047',   fram: 'PH4967'  },
  'Lexus IS':                { wix: '57047',   fram: 'CH25723' },
  'Lexus LC':                { wix: '57047',   fram: 'CH9972'  },
  'Lexus LX':                { wix: '57310',   fram: 'CH10295' },
  'Lexus NX':                { wix: '51348',   fram: 'PH4967'  },
  'Lexus RC':                { wix: '57047',   fram: 'CH25723' },
  'Lexus RX':                { wix: '57047',   fram: 'CH9972'  },
  'Lexus TX':                { wix: '51348',   fram: 'PH4967'  },
  'Lexus UX':                { wix: '51348',   fram: 'PH4967'  },
  'Mitsubishi Eclipse Cross': { wix: '51334',  fram: 'PH5724'  },
  'Mitsubishi Lancer':       { wix: '51334',   fram: 'PH5724'  },
  'Mitsubishi Mirage':       { wix: '51334',   fram: 'PH5724'  },
  'Mitsubishi Outlander':    { wix: '51334',   fram: 'PH5724'  },
  'Mitsubishi Outlander Sport': { wix: '51334', fram: 'PH5724' },
  'Lincoln Aviator':         { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Lincoln Continental':     { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Lincoln Corsair':         { wix: '51348',   fram: 'PH3614',  motorcraft: 'FL-910-S' },
  'Lincoln MKX':             { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Lincoln MKZ':             { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Lincoln Nautilus':        { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
  'Lincoln Navigator':       { wix: '57502',   fram: 'PH10575', motorcraft: 'FL-500-S' },
}

// Match a vehicle to its oil + filter spec.
// Pass engine (e.g. "5.3L V8") to get engine-specific data — ENGINE_SPEC_DB
// is checked first, then the model-level DB + FILTER_DB fallback.
export function lookupOilSpec(make, model, year, engine = null) {
  const yr = Number(year)

  // ── Engine-specific lookup ───────────────────────────────────────────────
  if (engine) {
    const rows = ENGINE_SPEC_DB[`${make}|${model}|${engine}`]
    if (rows) {
      const match = rows
        .filter(r => yr >= r[0] && yr <= r[1])
        .sort((a, b) => b[0] - a[0])[0]
      if (match) {
        return {
          oil:        match[2],
          qt:         match[3],
          wix:        match[4] ?? null,
          fram:       match[5] ?? null,
          motorcraft: match[6] ?? null,
          oem:        null,
        }
      }
    }
  }

  // ── Model-level fallback ─────────────────────────────────────────────────
  const makeData = DB[make]
  if (!makeData) return null

  let rows = makeData[model]
  let resolvedModel = model

  // Fuzzy match: handle "Silverado 1500" → "Silverado", "Wrangler Unlimited" → "Wrangler", etc.
  if (!rows) {
    const key = Object.keys(makeData).find(k =>
      model.startsWith(k) || k.startsWith(model) ||
      model.toLowerCase().replace(/[^a-z0-9]/g, '').includes(k.toLowerCase().replace(/[^a-z0-9]/g, ''))
    )
    if (key) { rows = makeData[key]; resolvedModel = key }
  }

  if (!rows) return null

  const match = rows
    .filter(r => yr >= r[0] && yr <= r[1])
    .sort((a, b) => b[0] - a[0])[0]

  if (!match) return null

  const filter = FILTER_DB[`${make} ${resolvedModel}`] ?? null
  return {
    oil:        match[2],
    qt:         match[3],
    wix:        filter?.wix        ?? null,
    fram:       filter?.fram       ?? null,
    motorcraft: filter?.motorcraft ?? null,
    oem:        filter?.oem        ?? null,
  }
}

// Build a pre-filled Google search URL for the oil filter
export function filterSearchUrl(year, make, model, engineType) {
  const parts = [year, make, model, engineType, 'oil filter cross reference'].filter(Boolean)
  return `https://www.google.com/search?q=${encodeURIComponent(parts.join(' '))}`
}

// ── Engine options per vehicle ───────────────────────────────────────────────
// Key: 'Make|Model'  →  [[yearFrom, yearTo, [engine, ...]], ...]
// Exported so AddVehiclePage can populate a vehicle-specific engine dropdown.
export const ENGINES_DB = {
  'Chevrolet|Silverado 1500': [
    [2019, 9999, ['2.7L I4 Turbo', '4.3L V6', '5.3L V8', '6.2L V8']],
    [2014, 2018, ['4.3L V6', '5.3L V8', '6.2L V8']],
    [2007, 2013, ['4.3L V6', '4.8L V8', '5.3L V8', '6.0L V8', '6.2L V8']],
    [1999, 2006, ['4.3L V6', '4.8L V8', '5.3L V8', '6.0L V8']],
  ],
  'Chevrolet|Silverado 2500HD': [
    [2020, 9999, ['6.6L V8', '6.6L V8 Duramax Diesel']],
    [2011, 2019, ['6.0L V8', '6.6L V8 Duramax Diesel']],
  ],
  'Chevrolet|Silverado 3500HD': [
    [2020, 9999, ['6.6L V8', '6.6L V8 Duramax Diesel']],
    [2011, 2019, ['6.0L V8', '6.6L V8 Duramax Diesel']],
  ],
  'Chevrolet|Tahoe': [
    [2021, 9999, ['5.3L V8', '6.2L V8']],
    [2015, 2020, ['5.3L V8', '6.2L V8']],
    [2007, 2014, ['4.8L V8', '5.3L V8', '6.0L V8']],
  ],
  'Chevrolet|Suburban': [
    [2021, 9999, ['5.3L V8', '6.2L V8']],
    [2015, 2020, ['5.3L V8', '6.2L V8']],
  ],
  'Chevrolet|Colorado': [
    [2023, 9999, ['2.7L I4 Turbo', '2.7L I4 Turbo Plus']],
    [2015, 2022, ['2.5L I4', '3.6L V6', '2.8L Duramax Diesel']],
  ],
  'Chevrolet|Camaro': [
    [2016, 9999, ['2.0L I4 Turbo', '3.6L V6', '6.2L V8 LT1', '6.2L V8 ZL1']],
    [2010, 2015, ['3.6L V6', '6.2L V8']],
  ],
  'Chevrolet|Corvette': [
    [2020, 9999, ['6.2L V8 LT2']],
    [2014, 2019, ['6.2L V8 LT1', '6.2L V8 LT4']],
  ],
  'GMC|Sierra 1500': [
    [2019, 9999, ['2.7L I4 Turbo', '4.3L V6', '5.3L V8', '6.2L V8']],
    [2014, 2018, ['4.3L V6', '5.3L V8', '6.2L V8']],
    [2007, 2013, ['4.3L V6', '4.8L V8', '5.3L V8', '6.0L V8', '6.2L V8']],
    [1999, 2006, ['4.3L V6', '4.8L V8', '5.3L V8', '6.0L V8']],
  ],
  'GMC|Sierra 2500HD': [
    [2020, 9999, ['6.6L V8', '6.6L V8 Duramax Diesel']],
    [2011, 2019, ['6.0L V8', '6.6L V8 Duramax Diesel']],
  ],
  'GMC|Canyon': [
    [2023, 9999, ['2.7L I4 Turbo', '2.7L I4 Turbo AT4X']],
    [2015, 2022, ['2.5L I4', '3.6L V6', '2.8L Duramax Diesel']],
  ],
  'GMC|Yukon': [
    [2021, 9999, ['5.3L V8', '6.2L V8']],
    [2015, 2020, ['5.3L V8', '6.2L V8']],
  ],
  'GMC|Yukon XL': [
    [2021, 9999, ['5.3L V8', '6.2L V8']],
    [2015, 2020, ['5.3L V8', '6.2L V8']],
  ],
  'Cadillac|Escalade': [
    [2021, 9999, ['6.2L V8', '3.0L Diesel']],
    [2015, 2020, ['6.2L V8']],
  ],
  'Cadillac|Escalade ESV': [
    [2021, 9999, ['6.2L V8', '3.0L Diesel']],
    [2015, 2020, ['6.2L V8']],
  ],
  'Ford|F-150': [
    [2021, 9999, ['2.7L V6 EcoBoost', '3.3L V6', '3.5L V6 EcoBoost', '3.5L V6 PowerBoost HEV', '5.0L V8']],
    [2015, 2020, ['2.7L V6 EcoBoost', '3.5L V6', '3.5L V6 EcoBoost', '5.0L V8']],
    [2011, 2014, ['3.7L V6', '3.5L V6 EcoBoost', '5.0L V8', '6.2L V8']],
  ],
  'Ford|F-250 Super Duty': [
    [2020, 9999, ['6.2L V8', '7.3L V8', '6.7L V8 Power Stroke Diesel']],
    [2011, 2019, ['6.2L V8', '6.7L V8 Power Stroke Diesel']],
  ],
  'Ford|Mustang': [
    [2018, 9999, ['2.3L I4 EcoBoost', '5.0L V8 GT', '5.2L V8 GT500']],
    [2015, 2017, ['2.3L I4 EcoBoost', '5.0L V8 GT', '5.2L V8 GT350']],
  ],
  'Ford|Explorer': [
    [2020, 9999, ['2.3L I4 EcoBoost', '3.0L V6 EcoBoost']],
    [2016, 2019, ['2.3L I4 EcoBoost', '3.5L V6', '3.5L V6 EcoBoost']],
    [2011, 2015, ['2.0L I4 EcoBoost', '3.5L V6']],
  ],
  'Ford|Expedition': [
    [2018, 9999, ['3.5L V6 EcoBoost', '3.5L V6 EcoBoost High Output']],
  ],
  'Ford|Ranger': [
    [2019, 9999, ['2.3L I4 EcoBoost']],
  ],
  'Ford|Bronco': [
    [2021, 9999, ['2.3L I4 EcoBoost', '2.7L V6 EcoBoost']],
  ],
  'Ram|1500': [
    [2019, 9999, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '3.0L V6 EcoDiesel']],
    [2013, 2018, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '3.0L V6 EcoDiesel']],
    [2009, 2012, ['3.7L V6', '4.7L V8', '5.7L V8 HEMI']],
  ],
  'Ram|2500': [
    [2014, 9999, ['5.7L V8 HEMI', '6.4L V8 HEMI', '6.7L Cummins Diesel']],
  ],
  'Ram|3500': [
    [2014, 9999, ['5.7L V8 HEMI', '6.4L V8 HEMI', '6.7L Cummins Diesel']],
  ],
  'Dodge|Challenger': [
    [2015, 9999, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI', '6.2L V8 Hellcat']],
    [2011, 2014, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI']],
  ],
  'Dodge|Charger': [
    [2015, 9999, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI', '6.2L V8 Hellcat']],
    [2011, 2014, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI']],
  ],
  'Dodge|Durango': [
    [2018, 9999, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI']],
    [2011, 2017, ['3.6L V6 Pentastar', '5.7L V8 HEMI']],
  ],
  'Jeep|Wrangler': [
    [2018, 9999, ['2.0L I4 Turbo', '3.6L V6 Pentastar', '3.0L V6 EcoDiesel']],
    [2012, 2017, ['3.6L V6 Pentastar']],
  ],
  'Jeep|Wrangler Unlimited': [
    [2018, 9999, ['2.0L I4 Turbo', '3.6L V6 Pentastar', '3.0L V6 EcoDiesel']],
    [2012, 2017, ['3.6L V6 Pentastar']],
  ],
  'Jeep|Gladiator': [
    [2020, 9999, ['3.6L V6 Pentastar', '3.0L V6 EcoDiesel']],
  ],
  'Jeep|Grand Cherokee': [
    [2021, 9999, ['2.0L I4 Turbo', '3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI']],
    [2011, 2020, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI']],
  ],
  'Jeep|Grand Cherokee L': [
    [2021, 9999, ['3.6L V6 Pentastar', '5.7L V8 HEMI', '6.4L V8 HEMI']],
  ],
  'Jeep|Cherokee': [
    [2019, 9999, ['2.0L I4 Turbo', '3.2L V6 Pentastar']],
    [2014, 2018, ['2.4L I4 Tigershark', '3.2L V6 Pentastar']],
  ],
  'Toyota|Tacoma': [
    [2016, 9999, ['2.7L I4', '3.5L V6']],
    [2005, 2015, ['2.7L I4', '4.0L V6']],
  ],
  'Toyota|Tundra': [
    [2022, 9999, ['3.5L V6 Turbo', '3.5L V6 Turbo i-FORCE MAX HEV']],
    [2010, 2021, ['4.6L V8', '5.7L V8']],
    [2007, 2009, ['4.7L V8', '5.7L V8']],
  ],
  'Toyota|4Runner': [
    [2010, 9999, ['4.0L V6']],
  ],
  'Toyota|Sequoia': [
    [2022, 9999, ['3.5L V6 Turbo i-FORCE MAX HEV']],
    [2008, 2021, ['4.6L V8', '5.7L V8']],
  ],
  'Toyota|Highlander': [
    [2020, 9999, ['2.5L I4 Hybrid', '3.5L V6']],
    [2014, 2019, ['2.7L I4', '3.5L V6']],
  ],
  'Honda|Accord': [
    [2018, 9999, ['1.5L I4 Turbo', '2.0L I4 Turbo']],
    [2013, 2017, ['2.4L I4', '3.5L V6']],
  ],
  'Honda|Pilot': [
    [2023, 9999, ['3.5L V6']],
    [2016, 2022, ['3.5L V6']],
  ],
  'Nissan|Frontier': [
    [2022, 9999, ['3.8L V6']],
    [2005, 2021, ['2.5L I4', '4.0L V6']],
  ],
  'Nissan|Altima': [
    [2019, 9999, ['2.0L VC-Turbo', '2.5L I4']],
    [2013, 2018, ['2.5L I4', '3.5L V6']],
  ],
  'Nissan|Titan': [
    [2016, 9999, ['5.6L V8', '5.0L V8 Cummins Diesel']],
  ],
  'Subaru|WRX': [
    [2022, 9999, ['2.4L H4 Turbo']],
    [2015, 2021, ['2.0L H4 Turbo FA20DIT']],
  ],
  'Subaru|BRZ': [
    [2022, 9999, ['2.4L H4 FA24']],
    [2017, 2021, ['2.0L H4 FA20']],
  ],
  'BMW|3 Series': [
    [2019, 9999, ['2.0L I4 B48 (330i)', '3.0L I6 B58 (M340i)']],
    [2012, 2018, ['2.0L I4 B46 (320i)', '2.0L I4 N20 (328i)', '3.0L I6 N55 (335i)']],
  ],
  'BMW|5 Series': [
    [2017, 9999, ['2.0L I4 B48 (530i)', '3.0L I6 B58 (540i)']],
  ],
  'BMW|X5': [
    [2019, 9999, ['3.0L I6 B58 (xDrive40i)', '4.4L V8 N63 (xDrive50i)']],
  ],
}

// ── Engine-specific oil + filter specs ──────────────────────────────────────
// Key: 'Make|Model|Engine'
// Value: [[yearFrom, yearTo, oil, qt, wix, fram, motorcraft]]
// Takes precedence over the model-level DB + FILTER_DB when engine is known.
const ENGINE_SPEC_DB = {
  // ── Chevy / GMC full-size trucks ─────────────────────────────────────────
  // Pre-2014 (GMT800/GMT900): all gas engines share the same spin-on filter
  // AC Delco PF46 = Wix 51040 = Fram PH3506
  'Chevrolet|Silverado 1500|4.3L V6':         [[2007, 2013, '5W-30', 4.5, '51040', 'PH3506', null], [1999, 2006, '5W-30', 4.5, '51040', 'PH3506', null]],
  'Chevrolet|Silverado 1500|4.8L V8':         [[2007, 2013, '5W-30', 6.0, '51040', 'PH3506', null], [1999, 2006, '5W-30', 6.0, '51040', 'PH3506', null]],
  'Chevrolet|Silverado 1500|5.3L V8':         [[2019, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2014, 2018, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2007, 2013, '5W-30', 6.0, '51040', 'PH3506', null], [1999, 2006, '5W-30', 6.0, '51040', 'PH3506', null]],
  'Chevrolet|Silverado 1500|6.0L V8':         [[2007, 2013, '5W-30', 6.0, '51040', 'PH3506', null]],
  'Chevrolet|Silverado 1500|2.7L I4 Turbo':   [[2019, 9999, '0W-20', 6.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Silverado 1500|4.3L V6':         [[2014, 2018, '5W-30', 6.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Silverado 1500|6.2L V8':         [[2014, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],

  'GMC|Sierra 1500|4.3L V6':                 [[2007, 2013, '5W-30', 4.5, '51040', 'PH3506', null], [1999, 2006, '5W-30', 4.5, '51040', 'PH3506', null], [2014, 9999, '5W-30', 6.0, 'WL10255', 'PH12060', null]],
  'GMC|Sierra 1500|4.8L V8':                 [[2007, 2013, '5W-30', 6.0, '51040', 'PH3506', null], [1999, 2006, '5W-30', 6.0, '51040', 'PH3506', null]],
  'GMC|Sierra 1500|5.3L V8':                 [[2019, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2014, 2018, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2007, 2013, '5W-30', 6.0, '51040', 'PH3506', null], [1999, 2006, '5W-30', 6.0, '51040', 'PH3506', null]],
  'GMC|Sierra 1500|6.0L V8':                 [[2007, 2013, '5W-30', 6.0, '51040', 'PH3506', null]],
  'GMC|Sierra 1500|2.7L I4 Turbo':           [[2019, 9999, '0W-20', 6.0, 'WL10255', 'PH12060', null]],
  'GMC|Sierra 1500|6.2L V8':                 [[2014, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],

  // ── Chevy/GMC SUVs ───────────────────────────────────────────────────────
  'Chevrolet|Tahoe|4.8L V8':                 [[2007, 2014, '5W-30', 6.0, '51040', 'PH3506', null]],
  'Chevrolet|Tahoe|5.3L V8':                 [[2021, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2015, 2020, '5W-30', 8.0, 'WL10255', 'PH12060', null], [2007, 2014, '5W-30', 6.0, '51040', 'PH3506', null]],
  'Chevrolet|Tahoe|6.0L V8':                 [[2007, 2014, '5W-30', 6.0, '51040', 'PH3506', null]],
  'Chevrolet|Tahoe|6.2L V8':                 [[2015, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Suburban|5.3L V8':              [[2021, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2015, 2020, '5W-30', 8.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Suburban|6.2L V8':              [[2015, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],
  'GMC|Yukon|5.3L V8':                       [[2021, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2015, 2020, '5W-30', 8.0, 'WL10255', 'PH12060', null]],
  'GMC|Yukon|6.2L V8':                       [[2015, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],
  'GMC|Yukon XL|5.3L V8':                    [[2021, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null], [2015, 2020, '5W-30', 8.0, 'WL10255', 'PH12060', null]],
  'GMC|Yukon XL|6.2L V8':                    [[2015, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],
  'Cadillac|Escalade|6.2L V8':               [[2015, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],
  'Cadillac|Escalade ESV|6.2L V8':           [[2015, 9999, '0W-20', 8.0, 'WL10255', 'PH12060', null]],

  // ── Chevy Colorado / GMC Canyon ─────────────────────────────────────────
  'Chevrolet|Colorado|2.5L I4':              [[2015, 2022, '5W-30', 5.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Colorado|3.6L V6':              [[2015, 2022, '5W-30', 6.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Colorado|2.7L I4 Turbo':        [[2023, 9999, '0W-20', 6.0, 'WL10255', 'PH12060', null]],
  'GMC|Canyon|2.5L I4':                      [[2015, 2022, '5W-30', 5.0, 'WL10255', 'PH12060', null]],
  'GMC|Canyon|3.6L V6':                      [[2015, 2022, '5W-30', 6.0, 'WL10255', 'PH12060', null]],
  'GMC|Canyon|2.7L I4 Turbo':                [[2023, 9999, '0W-20', 6.0, 'WL10255', 'PH12060', null]],

  // ── Chevy Camaro ─────────────────────────────────────────────────────────
  'Chevrolet|Camaro|2.0L I4 Turbo':          [[2016, 9999, '0W-20', 4.2, 'WL10255', 'PH12060', null]],
  'Chevrolet|Camaro|3.6L V6':                [[2010, 9999, '5W-30', 5.9, 'WL10255', 'PH12060', null]],
  'Chevrolet|Camaro|6.2L V8 LT1':            [[2016, 9999, '5W-30', 8.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Camaro|6.2L V8 ZL1':            [[2017, 9999, '5W-30', 8.0, 'WL10255', 'PH12060', null]],
  'Chevrolet|Camaro|6.2L V8':                [[2010, 2015, '5W-30', 8.0, 'WL10255', 'PH12060', null]],

  // ── Ford F-150 (all share FL-500-S; oil weight/capacity differs by engine) ──
  'Ford|F-150|3.7L V6':                      [[2011, 2014, '5W-20', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|F-150|3.5L V6':                      [[2015, 2020, '5W-20', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|F-150|3.5L V6 EcoBoost':             [[2015, 9999, '5W-30', 6.0, '57502', 'PH10575', 'FL-500-S'], [2011, 2014, '5W-30', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|F-150|3.5L V6 PowerBoost HEV':       [[2021, 9999, '5W-30', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|F-150|2.7L V6 EcoBoost':             [[2015, 9999, '5W-30', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|F-150|3.3L V6':                      [[2018, 9999, '5W-20', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|F-150|5.0L V8':                      [[2021, 9999, '5W-30', 8.0, '57502', 'PH10575', 'FL-500-S'], [2011, 2020, '5W-20', 8.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|F-150|6.2L V8':                      [[2011, 2014, '5W-50', 7.0, '57502', 'PH10575', 'FL-500-S']],

  // ── Ford Mustang ─────────────────────────────────────────────────────────
  'Ford|Mustang|2.3L I4 EcoBoost':           [[2015, 9999, '5W-30', 5.7, '51348', 'PH3614', 'FL-910-S']],
  'Ford|Mustang|5.0L V8 GT':                 [[2015, 9999, '5W-50', 8.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|Mustang|5.2L V8 GT350':              [[2015, 2020, '5W-50', 12.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|Mustang|5.2L V8 GT500':              [[2020, 9999, '5W-50', 12.0, '57502', 'PH10575', 'FL-500-S']],

  // ── Ford Explorer ────────────────────────────────────────────────────────
  'Ford|Explorer|2.0L I4 EcoBoost':          [[2011, 2015, '5W-20', 5.0, '51348', 'PH3614', 'FL-910-S']],
  'Ford|Explorer|2.3L I4 EcoBoost':          [[2016, 9999, '5W-30', 5.7, '51348', 'PH3614', 'FL-910-S']],
  'Ford|Explorer|3.5L V6':                   [[2011, 2019, '5W-20', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|Explorer|3.5L V6 EcoBoost':          [[2013, 2019, '5W-30', 6.0, '57502', 'PH10575', 'FL-500-S']],
  'Ford|Explorer|3.0L V6 EcoBoost':          [[2020, 9999, '5W-30', 5.7, '57502', 'PH10575', 'FL-500-S']],

  // ── Ford Bronco ──────────────────────────────────────────────────────────
  'Ford|Bronco|2.3L I4 EcoBoost':            [[2021, 9999, '5W-30', 5.7, '51348', 'PH3614', 'FL-910-S']],
  'Ford|Bronco|2.7L V6 EcoBoost':            [[2021, 9999, '5W-30', 5.7, '57502', 'PH10575', 'FL-500-S']],

  // ── Ram 1500 ─────────────────────────────────────────────────────────────
  // 3.6L Pentastar: smaller spin-on (Wix 57060); 5.7L HEMI: larger spin-on (Wix 57899)
  'Ram|1500|3.6L V6 Pentastar':              [[2019, 9999, '5W-20', 5.0, '57060', 'PH10060', null], [2013, 2018, '5W-20', 5.0, '57060', 'PH10060', null]],
  'Ram|1500|5.7L V8 HEMI':                   [[2009, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Ram|1500|3.7L V6':                        [[2009, 2012, '5W-20', 4.5, '57060', 'PH10060', null]],
  'Ram|1500|4.7L V8':                        [[2009, 2012, '5W-20', 5.9, '57060', 'PH10060', null]],
  'Ram|2500|5.7L V8 HEMI':                   [[2014, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Ram|2500|6.4L V8 HEMI':                   [[2014, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Ram|3500|5.7L V8 HEMI':                   [[2014, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Ram|3500|6.4L V8 HEMI':                   [[2014, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],

  // ── Dodge Challenger / Charger ───────────────────────────────────────────
  'Dodge|Challenger|3.6L V6 Pentastar':      [[2011, 9999, '5W-20', 5.9, '57060', 'PH10060', null]],
  'Dodge|Challenger|5.7L V8 HEMI':           [[2011, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Dodge|Challenger|6.4L V8 HEMI':           [[2012, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Dodge|Challenger|6.2L V8 Hellcat':        [[2015, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Dodge|Charger|3.6L V6 Pentastar':         [[2011, 9999, '5W-20', 5.9, '57060', 'PH10060', null]],
  'Dodge|Charger|5.7L V8 HEMI':              [[2011, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Dodge|Charger|6.4L V8 HEMI':              [[2012, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Dodge|Charger|6.2L V8 Hellcat':           [[2015, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Dodge|Durango|3.6L V6 Pentastar':         [[2011, 9999, '5W-20', 5.9, '57060', 'PH10060', null]],
  'Dodge|Durango|5.7L V8 HEMI':              [[2011, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Dodge|Durango|6.4L V8 HEMI':              [[2018, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],

  // ── Jeep ─────────────────────────────────────────────────────────────────
  // Wrangler JL 2.0T uses cartridge; JL/JK 3.6L uses spin-on
  'Jeep|Wrangler|2.0L I4 Turbo':             [[2018, 9999, '0W-20', 5.0, 'WL10255', 'CH11665', null]],
  'Jeep|Wrangler|3.6L V6 Pentastar':         [[2018, 9999, '5W-20', 6.0, '57060', 'PH10060', null], [2012, 2017, '5W-20', 6.0, '57060', 'PH10060', null]],
  'Jeep|Wrangler Unlimited|2.0L I4 Turbo':   [[2018, 9999, '0W-20', 5.0, 'WL10255', 'CH11665', null]],
  'Jeep|Wrangler Unlimited|3.6L V6 Pentastar':[[2018, 9999, '5W-20', 6.0, '57060', 'PH10060', null], [2012, 2017, '5W-20', 6.0, '57060', 'PH10060', null]],
  'Jeep|Gladiator|3.6L V6 Pentastar':        [[2020, 9999, '5W-20', 6.0, 'WL10255', 'CH11665', null]],
  'Jeep|Grand Cherokee|3.6L V6 Pentastar':   [[2011, 9999, '5W-20', 5.9, '57060', 'PH10060', null]],
  'Jeep|Grand Cherokee|5.7L V8 HEMI':        [[2011, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Jeep|Grand Cherokee|6.4L V8 HEMI':        [[2013, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Jeep|Grand Cherokee|2.0L I4 Turbo':       [[2021, 9999, '0W-20', 5.0, 'WL10255', 'CH11665', null]],
  'Jeep|Grand Cherokee L|3.6L V6 Pentastar': [[2021, 9999, '5W-20', 5.9, '57060', 'PH10060', null]],
  'Jeep|Grand Cherokee L|5.7L V8 HEMI':      [[2021, 9999, '5W-20', 7.0, '57899', 'PH10060', null]],
  'Jeep|Cherokee|2.4L I4 Tigershark':        [[2014, 2018, '0W-20', 5.0, '57060', 'PH10060', null]],
  'Jeep|Cherokee|3.2L V6 Pentastar':         [[2014, 9999, '0W-20', 5.0, '57060', 'PH10060', null]],
  'Jeep|Cherokee|2.0L I4 Turbo':             [[2019, 9999, '0W-20', 5.0, '57060', 'PH10060', null]],

  // ── Toyota Tacoma ────────────────────────────────────────────────────────
  'Toyota|Tacoma|2.7L I4':                   [[2016, 9999, '0W-20', 5.8, '51348', 'PH4967', null], [2005, 2015, '5W-30', 5.5, '51348', 'PH4967', null]],
  'Toyota|Tacoma|3.5L V6':                   [[2016, 9999, '0W-20', 6.1, '59924TR', 'CH9972', null]],
  'Toyota|Tacoma|4.0L V6':                   [[2005, 2015, '5W-30', 5.5, '57047', 'PH4967', null]],

  // ── Toyota Tundra ────────────────────────────────────────────────────────
  'Toyota|Tundra|4.6L V8':                   [[2010, 2021, '5W-30', 6.4, '57047', 'PH4967', null]],
  'Toyota|Tundra|4.7L V8':                   [[2007, 2009, '5W-30', 6.0, '57047', 'PH4967', null]],
  'Toyota|Tundra|5.7L V8':                   [[2007, 2021, '5W-30', 7.4, '57310', 'CH10295', null]],
  'Toyota|Tundra|3.5L V6 Turbo':             [[2022, 9999, '0W-35', 7.3, '51348', 'PH4967', null]],
  'Toyota|Tundra|3.5L V6 Turbo i-FORCE MAX HEV': [[2022, 9999, '0W-35', 7.3, '51348', 'PH4967', null]],

  // ── Toyota 4Runner / Sequoia ──────────────────────────────────────────────
  'Toyota|4Runner|4.0L V6':                  [[2010, 9999, '5W-30', 5.5, '57047', 'PH4967', null]],
  'Toyota|Sequoia|4.6L V8':                  [[2010, 2021, '5W-30', 6.4, '57047', 'PH4967', null]],
  'Toyota|Sequoia|5.7L V8':                  [[2008, 2021, '5W-30', 7.4, '57310', 'CH10295', null]],

  // ── Toyota Highlander ────────────────────────────────────────────────────
  'Toyota|Highlander|2.7L I4':               [[2014, 2019, '0W-20', 4.4, '51348', 'PH4967', null]],
  'Toyota|Highlander|3.5L V6':               [[2014, 9999, '0W-20', 6.4, '57047', 'CH9972', null]],
  'Toyota|Highlander|2.5L I4 Hybrid':        [[2020, 9999, '0W-20', 6.4, '57047', 'CH25723', null]],

  // ── Honda Accord ─────────────────────────────────────────────────────────
  'Honda|Accord|1.5L I4 Turbo':              [[2018, 9999, '0W-20', 3.7, '57356', 'PH7317', null]],
  'Honda|Accord|2.0L I4 Turbo':              [[2018, 9999, '0W-20', 3.7, '57356', 'PH7317', null]],
  'Honda|Accord|2.4L I4':                    [[2013, 2017, '0W-20', 4.2, '57356', 'PH7317', null]],
  'Honda|Accord|3.5L V6':                    [[2013, 2017, '0W-20', 4.2, '57356', 'PH7317', null]],

  // ── Nissan Altima / Frontier ─────────────────────────────────────────────
  'Nissan|Altima|2.0L VC-Turbo':             [[2019, 9999, '0W-20', 4.6, '51358', 'PH6607', null]],
  'Nissan|Altima|2.5L I4':                   [[2019, 9999, '0W-20', 4.6, '51358', 'PH6607', null], [2013, 2018, '5W-30', 4.9, '51358', 'PH6607', null]],
  'Nissan|Altima|3.5L V6':                   [[2013, 2018, '5W-30', 5.1, '57356', 'PH7317', null]],
  'Nissan|Frontier|2.5L I4':                 [[2005, 2021, '5W-30', 4.2, '51358', 'PH6607', null]],
  'Nissan|Frontier|4.0L V6':                 [[2005, 2021, '5W-30', 5.1, '57356', 'PH7317', null]],
  'Nissan|Frontier|3.8L V6':                 [[2022, 9999, '5W-30', 5.1, '57356', 'PH7317', null]],

  // ── Subaru ───────────────────────────────────────────────────────────────
  'Subaru|WRX|2.0L H4 Turbo FA20DIT':        [[2015, 2021, '5W-30', 5.4, 'WL10078', 'XG9688', null]],
  'Subaru|WRX|2.4L H4 Turbo':                [[2022, 9999, '5W-30', 5.4, '57055', 'PH9688', null]],
  'Subaru|BRZ|2.0L H4 FA20':                 [[2017, 2021, '5W-30', 5.3, '57055', 'PH9688', null]],
  'Subaru|BRZ|2.4L H4 FA24':                 [[2022, 9999, '5W-30', 5.3, '57055', 'PH9688', null]],

  // ── BMW ──────────────────────────────────────────────────────────────────
  'BMW|3 Series|2.0L I4 B48 (330i)':         [[2019, 9999, '0W-30', 5.3, 'WL10358', null, null]],
  'BMW|3 Series|3.0L I6 B58 (M340i)':        [[2019, 9999, '0W-30', 6.3, 'WL10358', null, null]],
  'BMW|5 Series|2.0L I4 B48 (530i)':         [[2017, 9999, '0W-30', 5.3, 'WL10358', null, null]],
  'BMW|5 Series|3.0L I6 B58 (540i)':         [[2017, 9999, '0W-30', 6.3, 'WL10358', null, null]],
  'BMW|X5|3.0L I6 B58 (xDrive40i)':          [[2019, 9999, '0W-30', 7.4, 'WL10358', null, null]],
}

// Return vehicle-specific engine options for the given year/make/model.
// Returns [] for vehicles not in ENGINES_DB (single-engine models).
export function getEngineOptions(make, model, year) {
  const key = `${make}|${model}`
  let ranges = ENGINES_DB[key]

  if (!ranges) {
    const k = Object.keys(ENGINES_DB).find(k => {
      const [m, mod] = k.split('|')
      return m === make && (
        model.startsWith(mod) || mod.startsWith(model) ||
        model.toLowerCase().replace(/[^a-z0-9]/g, '') === mod.toLowerCase().replace(/[^a-z0-9]/g, '')
      )
    })
    ranges = k ? ENGINES_DB[k] : null
  }

  if (!ranges) return []
  const yr = Number(year)
  const entry = ranges.find(([from, to]) => yr >= from && yr <= to)
  return entry ? entry[2] : []
}
