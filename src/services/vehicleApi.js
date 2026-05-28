import { MAKES, getModels, getYears } from '../data/vehicles.js'

export async function fetchMakes() {
  return MAKES
}

export async function fetchModels(make) {
  return getModels(make)
}

export { getYears }
