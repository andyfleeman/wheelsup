// Firebase Cloud Messaging service worker
// Handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyDLnrQ-wcbiFQ7zLTqYs1n8gl6GSikY828",
  authDomain: "wheelsup-be127.firebaseapp.com",
  projectId: "wheelsup-be127",
  storageBucket: "wheelsup-be127.firebasestorage.app",
  messagingSenderId: "837653517219",
  appId: "1:837653517219:web:ba95de0cc3778748dd8016"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {}
  self.registration.showNotification(title || 'Klyp', {
    body: body || 'You have a service reminder.',
    icon: icon || '/wheelsup/favicon.svg',
    badge: '/wheelsup/favicon.svg',
    tag: payload.data?.tag || 'klyp-notification',
  })
})
