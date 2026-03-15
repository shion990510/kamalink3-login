import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

const normalizeEnvValue = (value?: string) => {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  const unquoted = trimmed.replace(/^['\"]|['\"]$/g, '')
  return unquoted
}

const normalizePrivateKey = (value?: string) => {
  const normalized = normalizeEnvValue(value)
  if (!normalized) {
    return undefined
  }

  return normalized.replace(/\\n/g, '\n')
}

const serviceAccount = {
  projectId: normalizeEnvValue(process.env.FIREBASE_PROJECT_ID),
  privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
  clientEmail: normalizeEnvValue(process.env.FIREBASE_CLIENT_EMAIL),
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  })
}

export const auth = admin.auth()
export const db = admin.firestore()

export default admin
