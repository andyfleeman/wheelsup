import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDLnrQ-wcbiFQ7zLTqYs1n8gl6GSikY828",
  authDomain: "wheelsup-be127.firebaseapp.com",
  projectId: "wheelsup-be127",
  storageBucket: "wheelsup-be127.firebasestorage.app",
  messagingSenderId: "837653517219",
  appId: "1:837653517219:web:ba95de0cc3778748dd8016"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
})
export const googleProvider = new GoogleAuthProvider()
