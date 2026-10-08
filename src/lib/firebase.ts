import { getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth is only available in the browser.')
  }

  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your-firebase-web-api-key') {
    throw new Error('Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local.')
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  return getAuth(app)
}

export function getFirebaseDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Cloud Firestore is only available in the browser.')
  }

  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your-firebase-web-api-key') {
    throw new Error('Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local.')
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  return getFirestore(app)
}
