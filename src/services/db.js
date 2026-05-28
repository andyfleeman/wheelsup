import {
  collection, doc, setDoc, getDoc, getDocs,
  addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// --- Vehicles ---
export async function saveVehicle(uid, vehicle) {
  const ref = vehicle.id
    ? doc(db, 'users', uid, 'vehicles', vehicle.id)
    : doc(collection(db, 'users', uid, 'vehicles'))
  await setDoc(ref, { ...vehicle, id: ref.id, updatedAt: serverTimestamp() }, { merge: true })
  return ref.id
}

export async function getVehicles(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'vehicles'))
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export async function deleteVehicle(uid, vehicleId) {
  await deleteDoc(doc(db, 'users', uid, 'vehicles', vehicleId))
}

// --- Maintenance Records ---
export async function saveMaintenanceRecord(uid, vehicleId, record) {
  const ref = record.id
    ? doc(db, 'users', uid, 'vehicles', vehicleId, 'records', record.id)
    : doc(collection(db, 'users', uid, 'vehicles', vehicleId, 'records'))
  await setDoc(ref, { ...record, id: ref.id, createdAt: serverTimestamp() }, { merge: true })
  return ref.id
}

export async function deleteMaintenanceRecord(uid, vehicleId, recordId) {
  await deleteDoc(doc(db, 'users', uid, 'vehicles', vehicleId, 'records', recordId))
}

export async function getMaintenanceRecords(uid, vehicleId) {
  const q = query(
    collection(db, 'users', uid, 'vehicles', vehicleId, 'records'),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

// --- Maintenance Intervals (per vehicle, per item) ---
export async function saveInterval(uid, vehicleId, itemId, interval) {
  const ref = doc(db, 'users', uid, 'vehicles', vehicleId, 'intervals', itemId)
  await setDoc(ref, interval, { merge: true })
}

export async function getIntervals(uid, vehicleId) {
  const snap = await getDocs(collection(db, 'users', uid, 'vehicles', vehicleId, 'intervals'))
  const result = {}
  snap.docs.forEach(d => { result[d.id] = d.data() })
  return result
}
